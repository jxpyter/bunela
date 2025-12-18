import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  settings: {
    daily_goal: number;
    target_levels: string[];
    new_word_limit: number;
    notifications_enabled: boolean;
  };
  stats: {
    total_words_learned: number;
    current_streak: number;
    longest_streak: number;
    last_study_date: Date | null;
  };
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    settings: {
      daily_goal: {
        type: Number,
        default: 20,
      },
      target_levels: {
        type: [String],
        default: ['A1', 'A2'],
      },
      new_word_limit: {
        type: Number,
        default: 10,
      },
      notifications_enabled: {
        type: Boolean,
        default: true,
      },
    },
    stats: {
      total_words_learned: {
        type: Number,
        default: 0,
      },
      current_streak: {
        type: Number,
        default: 0,
      },
      longest_streak: {
        type: Number,
        default: 0,
      },
      last_study_date: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
