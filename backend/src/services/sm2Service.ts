import { IUserProgress } from '../models/UserProgress';

interface SM2Result {
  interval: number;
  easeFactor: number;
  nextReviewAt: Date;
  repetitions: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

/**
 * SM-2 Spaced Repetition Algorithm
 * @param quality - Quality of recall (0-5)
 *   0: Complete blackout
 *   1: Incorrect but familiar
 *   2: Incorrect but easy to recall
 *   3: Correct but difficult
 *   4: Correct with some hesitation
 *   5: Perfect recall
 * @param progress - Current user progress data
 * @returns Updated interval, ease factor, next review date, and repetitions
 */
export function calculateNextReview(quality: number, progress: Partial<IUserProgress>): SM2Result {
  let ef = progress.ease_factor || 2.5;
  let interval = progress.interval || 0;
  let repetitions = progress.repetitions || 0;
  
  // Update ease factor
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Minimum ease factor is 1.3
  if (ef < 1.3) {
    ef = 1.3;
  }
  
  // Calculate interval based on quality
  if (quality < 3) {
    // Incorrect response - reset
    repetitions = 0;
    interval = 1;
  } else {
    // Correct response
    repetitions += 1;
    
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
  }
  
  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);
  
  // Determine status
  let status: 'new' | 'learning' | 'review' | 'mastered' = 'learning';
  
  if (repetitions === 0) {
    status = 'new';
  } else if (repetitions < 3) {
    status = 'learning';
  } else if (interval >= 21) {
    status = 'mastered';
  } else {
    status = 'review';
  }
  
  return {
    interval,
    easeFactor: ef,
    nextReviewAt,
    repetitions,
    status,
  };
}

/**
 * Determine if a word is due for review
 */
export function isDueForReview(nextReviewAt: Date): boolean {
  return new Date() >= new Date(nextReviewAt);
}
