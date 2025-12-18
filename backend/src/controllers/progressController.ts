import { Response } from 'express';
import UserProgress from '../models/UserProgress';
import Word from '../models/Word';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { calculateNextReview } from '../services/sm2Service';

// @desc    Get words due for review
// @route   GET /api/progress/due
// @access  Private
export const getDueWords = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const now = new Date();

    const dueProgress = await UserProgress.find({
      user_id: userId,
      next_review_at: { $lte: now },
    })
      .populate('word_id')
      .sort({ next_review_at: 1 })
      .limit(20);

    res.json({
      success: true,
      count: dueProgress.length,
      data: dueProgress,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get new words to learn
// @route   GET /api/progress/new
// @access  Private
export const getNewWords = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const limit = req.user?.settings.new_word_limit || 10;
    const requestedLevel = req.query.level as string;
    // If specific level requested, use it. Otherwise use user settings.
    // If specific level requested, use it. Otherwise use ALL levels as per user request.
    const allLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const targetLevels = requestedLevel && requestedLevel !== 'all' 
      ? [requestedLevel] 
      : allLevels;

    // Get words user hasn't started yet
    const learnedWordIds = await UserProgress.find({ user_id: userId }).distinct('word_id');

    // Use aggregation to sample random words
    const newWords = await Word.aggregate([
      { 
        $match: {
          _id: { $nin: learnedWordIds },
          level: { $in: targetLevels }
        }
      },
      { $sample: { size: Number(limit) } }
    ]);

    res.json({
      success: true,
      count: newWords.length,
      data: newWords,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit word review
// @route   POST /api/progress/review
// @access  Private
export const submitReview = async (req: AuthRequest, res: Response) => {
  try {
    const { word_id, quality } = req.body;
    const userId = req.user?._id;

    if (quality < 0 || quality > 5) {
      return res.status(400).json({ success: false, message: 'Quality must be between 0 and 5' });
    }

    // Find or create progress
    let progress = await UserProgress.findOne({ user_id: userId, word_id });

    if (!progress) {
      // First time seeing this word
      progress = new UserProgress({
        user_id: userId,
        word_id,
        next_review_at: new Date(),
        interval: 0,
        ease_factor: 2.5,
        repetitions: 0,
        status: 'new',
      });
    }

    // Calculate next review using SM-2
    const sm2Result = calculateNextReview(quality, progress);

    // Update progress
    progress.interval = sm2Result.interval;
    progress.ease_factor = sm2Result.easeFactor;
    progress.next_review_at = sm2Result.nextReviewAt;
    progress.repetitions = sm2Result.repetitions;
    progress.status = sm2Result.status;
    progress.times_reviewed += 1;
    progress.last_reviewed = new Date();
    progress.quality_history.push(quality);

    // Keep only last 10 quality scores
    if (progress.quality_history.length > 10) {
      progress.quality_history = progress.quality_history.slice(-10);
    }

    await progress.save();

    // Update user stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = req.user;
    if (user) {
      const lastStudyDate = user.stats.last_study_date ? new Date(user.stats.last_study_date) : null;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (!lastStudyDate || lastStudyDate < yesterday) {
        // Streak broken or first time
        user.stats.current_streak = 1;
      } else if (lastStudyDate.getTime() === yesterday.getTime()) {
        // Continuing streak
        user.stats.current_streak += 1;
      }

      user.stats.longest_streak = Math.max(user.stats.current_streak, user.stats.longest_streak);
      user.stats.last_study_date = today;

      if (sm2Result.status === 'mastered' && progress.times_reviewed === 1) {
        user.stats.total_words_learned += 1;
      }

      await user.save();
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/progress/stats
// @access  Private
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const totalProgress = await UserProgress.countDocuments({ user_id: userId });
    const newWords = await UserProgress.countDocuments({ user_id: userId, status: 'new' });
    const learning = await UserProgress.countDocuments({ user_id: userId, status: 'learning' });
    const review = await UserProgress.countDocuments({ user_id: userId, status: 'review' });
    const mastered = await UserProgress.countDocuments({ user_id: userId, status: 'mastered' });

    const dueToday = await UserProgress.countDocuments({
      user_id: userId,
      next_review_at: { $lte: new Date() },
    });

    res.json({
      success: true,
      data: {
        total_words: totalProgress,
        new: newWords,
        learning,
        review,
        mastered,
        due_today: dueToday,
        user_stats: req.user?.stats,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get learned words for practice (random order)
// @route   GET /api/progress/practice
// @access  Private
export const getPracticeWords = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const requestedLevel = req.query.level as string;
    const limit = 20;

    const pipeline: any[] = [
      { $match: { user_id: userId } },
      {
        $lookup: {
          from: 'words',
          localField: 'word_id',
          foreignField: '_id',
          as: 'word_doc'
        }
      },
      { $unwind: '$word_doc' }
    ];

    if (requestedLevel && requestedLevel !== 'all') {
      pipeline.push({
        $match: { 'word_doc.level': requestedLevel }
      });
    }

    // Randomize order
    pipeline.push({ $sample: { size: limit } });
    
    pipeline.push({
      $project: {
        _id: 1,
        user_id: 1,
        word_id: '$word_doc',
        status: 1,
        next_review_at: 1,
      }
    });

    const practiceWords = await UserProgress.aggregate(pipeline);

    res.json({
      success: true,
      count: practiceWords.length,
      data: practiceWords,
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset all progress
// @route   POST /api/progress/reset
// @access  Private
export const resetProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    // Delete all progress records
    await UserProgress.deleteMany({ user_id: userId });

    // Reset user stats
    await User.findByIdAndUpdate(userId, {
      stats: {
        total_words_learned: 0,
        current_streak: 0,
        longest_streak: 0,
        last_study_date: null,
      }
    });

    res.json({
      success: true,
      message: 'Progress reset successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
