export interface Word {
  _id: string;
  word: string;
  definition: string;
  meaning: string;
  example_sentences?: string[];
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  created_at: string;
  updated_at: string;
}

export interface User {
  _id: string;
  email: string;
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
    last_study_date: string | null;
  };
}

export interface UserProgress {
  _id: string;
  user_id: string;
  word_id: Word | string;
  next_review_at: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
  quality_history: number[];
  times_reviewed: number;
  last_reviewed: string | null;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface StatsResponse {
  success: boolean;
  data: {
    total_words: number;
    new: number;
    learning: number;
    review: number;
    mastered: number;
    due_today: number;
    user_stats: User['stats'];
  };
}
