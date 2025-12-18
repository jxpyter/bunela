import { Response } from 'express';
import Word from '../models/Word';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all words
// @route   GET /api/words
// @access  Public
export const getWords = async (req: AuthRequest, res: Response) => {
  try {
    const { level, search, page = 1, limit = 20 } = req.query;

    const query: any = {};
    
    if (level) {
      query.level = level;
    }
    
    if (search) {
      query.$or = [
        { word: { $regex: search, $options: 'i' } },
        { definition: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Word.countDocuments(query);
    const words = await Word.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ created_at: -1 });

    res.json({
      success: true,
      count: words.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: words,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single word
// @route   GET /api/words/:id
// @access  Public
export const getWord = async (req: AuthRequest, res: Response) => {
  try {
    const word = await Word.findById(req.params.id);

    if (!word) {
      return res.status(404).json({ success: false, message: 'Word not found' });
    }

    res.json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new word
// @route   POST /api/words
// @access  Private/Admin
export const createWord = async (req: AuthRequest, res: Response) => {
  try {
    req.body.created_by = req.user?._id;
    
    const word = await Word.create(req.body);

    res.status(201).json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update word
// @route   PUT /api/words/:id
// @access  Private/Admin
export const updateWord = async (req: AuthRequest, res: Response) => {
  try {
    const word = await Word.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!word) {
      return res.status(404).json({ success: false, message: 'Word not found' });
    }

    res.json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete word
// @route   DELETE /api/words/:id
// @access  Private/Admin
export const deleteWord = async (req: AuthRequest, res: Response) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id);

    if (!word) {
      return res.status(404).json({ success: false, message: 'Word not found' });
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk import words
// @route   POST /api/words/bulk-import
// @access  Private/Admin
export const bulkImportWords = async (req: AuthRequest, res: Response) => {
  try {
    const { words } = req.body;

    if (!Array.isArray(words)) {
      return res.status(400).json({ success: false, message: 'Words must be an array' });
    }

    // Add created_by to all words
    const wordsWithCreator = words.map(word => ({
      ...word,
      created_by: req.user?._id,
    }));

    const result = await Word.insertMany(wordsWithCreator, { ordered: false });

    res.status(201).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export all words
// @route   GET /api/words/export
// @access  Private/Admin
export const exportWords = async (req: AuthRequest, res: Response) => {
  try {
    const words = await Word.find({}).select('-created_by -created_at -updated_at -__v');

    res.json({
      success: true,
      count: words.length,
      data: words,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fix DB Indexes
// @route   GET /api/words/fix-db/now
// @access  Private/Admin
export const fixDbWords = async (req: AuthRequest, res: Response) => {
  try {
    const result = await Word.collection.dropIndex('word_1');
    res.json({ success: true, message: 'Dropped word_1 index', result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
