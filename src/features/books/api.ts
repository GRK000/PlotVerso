import { supabase } from '@/shared/lib/supabase';
import { demoBooks } from '@/shared/data/demo';
import type { Book, BookStatus, UserBook } from '@/shared/types/domain';

export async function searchBooks(query: string): Promise<Book[]> {
  if (query.trim().length < 2) return [];
  const { data, error } = await supabase.functions.invoke('search-books', { body: { query } });
  if (!error && Array.isArray(data?.books)) return data.books;
  const q = query.toLowerCase();
  return demoBooks.filter((book) => `${book.title} ${book.authors.join(' ')}`.toLowerCase().includes(q));
}

export async function upsertUserBook(userId: string, book: Book, values: Partial<UserBook> & { status: BookStatus }) {
  const { data: existing } = await supabase.from('books').upsert(book, { onConflict: 'open_library_id,google_books_id' }).select().single();
  const savedBook = existing ?? book;
  return supabase.from('user_books').upsert({
    user_id: userId,
    book_id: savedBook.id,
    status: values.status,
    rating: values.rating ?? null,
    private_note: values.private_note ?? null,
    public_comment: values.public_comment ?? null,
    is_favorite: values.is_favorite ?? values.status === 'favorite',
    show_on_profile: values.show_on_profile ?? true
  });
}
