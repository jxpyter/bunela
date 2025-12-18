import mongoose, { Schema, Document } from 'mongoose';

export interface IWord extends Document {
  word: string;
  definition: string;
  meaning: string;
  example_sentences?: string[];
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const WordSchema = new Schema<IWord>(
  {
    word: {
      type: String,
      required: [true, 'Word is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    definition: {
      type: String,
      required: [true, 'Definition is required'],
    },
    meaning: {
      type: String,
      required: [true, 'Turkish meaning is required'],
    },
    example_sentences: {
      type: [String],
      default: [],
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      index: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Index for efficient searching
WordSchema.index({ word: 'text', definition: 'text', meaning: 'text' });
// Compound index to allow same word with different POS or Level
WordSchema.index({ word: 1, level: 1 }, { unique: true });

export default mongoose.model<IWord>('Word', WordSchema);
