import { supabase } from '@/shared/lib/supabase';
import { env } from '@/shared/lib/env';
import { currentDemoUser, demoBooks, demoUsers } from '@/shared/data/demo';
import type { Book, CompatibilityResult, Match, Message, PublicUser, UserBook } from '@/shared/types/domain';
import { rankCandidates, scoreCompatibility } from '@/features/discover/matching';

export type DataMode = 'demo' | 'supabase';
export type Candidate = { candidate: PublicUser; compatibility: CompatibilityResult };

export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

type SupabaseProfile = PublicUser['profile'];
type SupabasePhoto = PublicUser['photos'][number];
type SupabaseReader = PublicUser['reader'];
type SupabaseBook = Book;
type SupabaseUserBook = Omit<UserBook, 'book'> & { books?: SupabaseBook | null; book?: SupabaseBook | null };
type SupabasePublicUserRow = SupabaseProfile & {
  profile_photos?: SupabasePhoto[] | null;
  reader_profiles?: SupabaseReader[] | SupabaseReader | null;
  user_books?: SupabaseUserBook[] | null;
};

const profileSelect = `
  *,
  profile_photos(*),
  reader_profiles(*),
  user_books(*, books(*))
`;

function hasSupabaseConfig() {
  return env.supabaseAnonKey.trim().length > 0;
}

export function getDataMode(): DataMode {
  return hasSupabaseConfig() ? 'supabase' : 'demo';
}

function readerFrom(row: SupabasePublicUserRow): SupabaseReader {
  const value = Array.isArray(row.reader_profiles) ? row.reader_profiles[0] : row.reader_profiles;
  return (
    value ?? {
      id: `${row.id}-reader`,
      user_id: row.id,
      preferred_formats: [],
      languages: [],
      favorite_genres: [],
      disliked_genres: [],
      favorite_authors: [],
      themes: [],
      tones: [],
      open_answers: {}
    }
  );
}

function mapPublicUser(row: SupabasePublicUserRow): PublicUser {
  return {
    profile: {
      id: row.id,
      display_name: row.display_name,
      birth_date: row.birth_date,
      interested_in: row.interested_in ?? [],
      onboarding_completed: row.onboarding_completed,
      visibility: row.visibility ?? {},
      ...(row.gender !== undefined ? { gender: row.gender } : {}),
      ...(row.relationship_intent !== undefined ? { relationship_intent: row.relationship_intent } : {}),
      ...(row.city !== undefined ? { city: row.city } : {}),
      ...(row.country !== undefined ? { country: row.country } : {}),
      ...(row.bio !== undefined ? { bio: row.bio } : {}),
      ...(row.created_at !== undefined ? { created_at: row.created_at } : {}),
      ...(row.updated_at !== undefined ? { updated_at: row.updated_at } : {})
    },
    photos: row.profile_photos ?? [],
    reader: readerFrom(row),
    library: (row.user_books ?? []).map((item) => ({
      ...item,
      book: item.book ?? item.books ?? {
        id: item.book_id,
        title: 'Libro sin metadatos',
        authors: [],
        source: 'supabase'
      }
    }))
  };
}

async function getSessionUserId(): Promise<string | null> {
  if (!hasSupabaseConfig()) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new RepositoryError('No se pudo leer la sesión de Supabase.', error);
  return data.user?.id ?? null;
}

async function getSupabaseCurrentUser(): Promise<PublicUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const { data, error } = await supabase.from('profiles').select(profileSelect).eq('id', userId).maybeSingle();
  if (error) throw new RepositoryError('No se pudo cargar el perfil actual.', error);
  return data ? mapPublicUser(data as SupabasePublicUserRow) : null;
}

export async function getCurrentUser(): Promise<PublicUser> {
  if (getDataMode() === 'demo') return currentDemoUser;
  return (await getSupabaseCurrentUser()) ?? currentDemoUser;
}

export async function getPublicUser(userId: string): Promise<PublicUser | null> {
  if (getDataMode() === 'demo') return demoUsers.find((user) => user.profile.id === userId) ?? null;
  const { data, error } = await supabase.from('profiles').select(profileSelect).eq('id', userId).maybeSingle();
  if (error) throw new RepositoryError('No se pudo cargar el perfil público.', error);
  return data ? mapPublicUser(data as SupabasePublicUserRow) : demoUsers.find((user) => user.profile.id === userId) ?? null;
}

export async function getDiscoverCandidatesForCurrentUser(): Promise<Candidate[]> {
  const current = await getCurrentUser();
  if (getDataMode() === 'demo') return rankCandidates(current, demoUsers.filter((user) => user.profile.id !== current.profile.id));
  const { data, error } = await supabase
    .from('profiles')
    .select(profileSelect)
    .eq('onboarding_completed', true)
    .neq('id', current.profile.id)
    .limit(30);
  if (error) throw new RepositoryError('No se pudieron cargar perfiles compatibles.', error);
  const candidates = (data as SupabasePublicUserRow[] | null)?.map(mapPublicUser) ?? [];
  return rankCandidates(current, candidates.length ? candidates : demoUsers.slice(1));
}

export async function getLibraryForCurrentUser(): Promise<UserBook[]> {
  return (await getCurrentUser()).library;
}

export async function getBookForCurrentUser(bookId: string): Promise<{ item: UserBook | null; book: Book } | null> {
  const user = await getCurrentUser();
  const item = user.library.find((entry) => entry.book_id === bookId) ?? null;
  const book = item?.book ?? demoBooks.find((entry) => entry.id === bookId);
  return book ? { item, book } : null;
}

export async function searchBooksRepository(query: string): Promise<Book[]> {
  if (query.trim().length < 2) return [];
  if (getDataMode() === 'supabase') {
    const { data, error } = await supabase.functions.invoke('search-books', { body: { query } });
    if (!error && Array.isArray(data?.books)) return data.books as Book[];
  }
  const q = query.toLowerCase();
  return demoBooks.filter((book) => `${book.title} ${book.authors.join(' ')}`.toLowerCase().includes(q));
}

export async function getMatchesForCurrentUser(): Promise<Match[]> {
  const current = await getCurrentUser();
  if (getDataMode() === 'demo') {
    return demoUsers.slice(1, 4).map((user, index) => ({
      id: `m-${index + 1}`,
      user_a_id: current.profile.id,
      user_b_id: user.profile.id,
      compatibility_score: scoreCompatibility(current, user).score,
      status: 'active',
      created_at: new Date().toISOString(),
      otherUser: user,
      lastMessage: {
        id: `msg-${index}`,
        match_id: `m-${index + 1}`,
        sender_id: user.profile.id,
        body: index === 0 ? 'Me interesa lo que comentas sobre novela psicológica.' : 'Tengo pendiente revisar tu biblioteca.',
        was_ai_assisted: false,
        created_at: new Date().toISOString()
      }
    }));
  }
  const { data, error } = await supabase.from('matches').select('*').eq('status', 'active').order('created_at', { ascending: false });
  if (error) throw new RepositoryError('No se pudieron cargar los matches.', error);
  return (data as Match[] | null) ?? [];
}

export async function getMessagesRepository(matchId: string): Promise<Message[]> {
  if (getDataMode() === 'demo' || matchId.startsWith('m-')) {
    return [
      {
        id: `${matchId}-seed-1`,
        match_id: matchId,
        sender_id: 'u2',
        body: 'He visto que también lees ensayo narrativo.',
        was_ai_assisted: false,
        created_at: new Date(Date.now() - 60000).toISOString()
      }
    ];
  }
  const { data, error } = await supabase.from('messages').select('*').eq('match_id', matchId).order('created_at');
  if (error) throw new RepositoryError('No se pudo cargar la conversación.', error);
  return (data as Message[] | null) ?? [];
}

export async function sendMessageRepository(matchId: string, senderId: string, body: string, wasAiAssisted: boolean) {
  if (getDataMode() === 'demo' || matchId.startsWith('m-')) return;
  const { error } = await supabase.from('messages').insert({ match_id: matchId, sender_id: senderId, body, was_ai_assisted: wasAiAssisted });
  if (error) throw new RepositoryError('No se pudo enviar el mensaje.', error);
}

export async function recordLikeRepository(toUserId: string, value: 'like' | 'pass', score: number) {
  const current = await getCurrentUser();
  if (getDataMode() === 'demo') return;
  const { error } = await supabase.from('likes').upsert({ from_user_id: current.profile.id, to_user_id: toUserId, value });
  if (error) throw new RepositoryError('No se pudo registrar la acción.', error);
  if (value !== 'like') return;
  const { data, error: readError } = await supabase
    .from('likes')
    .select('id')
    .eq('from_user_id', toUserId)
    .eq('to_user_id', current.profile.id)
    .eq('value', 'like')
    .maybeSingle();
  if (readError) throw new RepositoryError('No se pudo comprobar el match.', readError);
  if (!data) return;
  const [userA, userB] = [current.profile.id, toUserId].sort();
  const { error: matchError } = await supabase.from('matches').upsert({
    user_a_id: userA,
    user_b_id: userB,
    compatibility_score: score,
    status: 'active'
  });
  if (matchError) throw new RepositoryError('No se pudo crear el match.', matchError);
}

export async function blockUserRepository(blockedId: string) {
  const current = await getCurrentUser();
  if (getDataMode() === 'demo') return;
  const { error } = await supabase.from('blocks').upsert({ blocker_id: current.profile.id, blocked_id: blockedId });
  if (error) throw new RepositoryError('No se pudo bloquear el perfil.', error);
}

export async function reportUserRepository(reportedUserId: string, reason: string, details?: string) {
  const current = await getCurrentUser();
  if (getDataMode() === 'demo') return;
  const { error } = await supabase.from('reports').insert({
    reporter_id: current.profile.id,
    reported_user_id: reportedUserId,
    reason,
    details
  });
  if (error) throw new RepositoryError('No se pudo enviar el reporte.', error);
}
