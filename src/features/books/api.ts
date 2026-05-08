import { supabase } from '@/shared/lib/supabase';
import { searchBooksRepository } from '@/shared/data/repository';
import type { Book, BookStatus, UserBook } from '@/shared/types/domain';

export async function searchBooks(query: string): Promise<Book[]> {
  return searchBooksRepository(query);
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
