export type ThemePreference = 'system' | 'light' | 'dark';

export type BookStatus = 'read' | 'reading' | 'pending' | 'abandoned' | 'favorite';

export type Profile = {
  id: string;
  display_name: string;
  birth_date: string;
  gender?: string | null;
  interested_in: string[];
  relationship_intent?: string | null;
  city?: string | null;
  country?: string | null;
  bio?: string | null;
  onboarding_completed: boolean;
  visibility: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
};

export type ProfilePhoto = {
  id: string;
  user_id: string;
  url: string;
  position: number;
};

export type ReaderProfile = {
  id: string;
  user_id: string;
  reading_frequency?: string | null;
  preferred_formats: string[];
  languages: string[];
  favorite_genres: string[];
  disliked_genres: string[];
  favorite_authors: string[];
  themes: string[];
  tones: string[];
  conversation_style?: string | null;
  open_answers: Record<string, string>;
  ai_summary?: string | null;
};

export type Book = {
  id?: string;
  title: string;
  subtitle?: string | null;
  authors: string[];
  isbn_10?: string | null;
  isbn_13?: string | null;
  open_library_id?: string | null;
  google_books_id?: string | null;
  cover_url?: string | null;
  description?: string | null;
  published_year?: number | null;
  language?: string | null;
  source?: string | null;
};

export type UserBook = {
  id: string;
  user_id: string;
  book_id: string;
  status: BookStatus;
  rating?: number | null;
  private_note?: string | null;
  public_comment?: string | null;
  is_favorite: boolean;
  show_on_profile: boolean;
  book: Book;
};

export type PublicUser = {
  profile: Profile;
  photos: ProfilePhoto[];
  reader: ReaderProfile;
  library: UserBook[];
  last_active_at?: string;
};

export type CompatibilityResult = {
  score: number;
  shared_books: string[];
  shared_authors: string[];
  shared_genres: string[];
  shared_themes: string[];
  contrast_points: string[];
  explanation: string[];
};

export type Match = {
  id: string;
  user_a_id: string;
  user_b_id: string;
  compatibility_score: number;
  status: 'active' | 'closed';
  created_at: string;
  otherUser?: PublicUser;
  lastMessage?: Message;
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  was_ai_assisted: boolean;
  created_at: string;
};
