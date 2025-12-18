import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  user_id: mongoose.Types.ObjectId;
  word_id: mongoose.Types.ObjectId;
  
  // SM-2 Algorithm data
  next_review_at: Date;
  interval: number; // days
  ease_factor: number;
  repetitions: number;
  
  // Learning data
  quality_history: number[];
  times_reviewed: number;
  last_reviewed: Date | null;
  status: 'new' | 'learning' | 'review' | 'mastered';
  
  created_at: Date;
  updated_at: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    word_id: {
      type: Schema.Types.ObjectId,
      ref: 'Word',
      required: true,
      index: true,
    },
    next_review_at: {
      type: Date,
      required: true,
      index: true,
    },
    interval: {
      type: Number,
      default: 0,
    },
    ease_factor: {
      type: Number,
      default: 2.5,
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    quality_history: {
      type: [Number],
      default: [],
    },
    times_reviewed: {
      type: Number,
      default: 0,
    },
    last_reviewed: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['new', 'learning', 'review', 'mastered'],
      default: 'new',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Compound index for unique user-word combination
UserProgressSchema.index({ user_id: 1, word_id: 1 }, { unique: true });

// Index for efficient queries
UserProgressSchema.index({ user_id: 1, next_review_at: 1 });
UserProgressSchema.index({ user_id: 1, status: 1 });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
