import type { Book } from '@/shared/types/domain';

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  isbn?: string[];
  cover_i?: number;
  first_publish_year?: number;
  language?: string[];
};

type GoogleVolume = {
  id?: string;
  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    industryIdentifiers?: { type: string; identifier: string }[];
    imageLinks?: { thumbnail?: string };
    description?: string;
    publishedDate?: string;
    language?: string;
  };
};

export function normalizeOpenLibrary(doc: OpenLibraryDoc): Book {
  const isbn10 = doc.isbn?.find((isbn) => isbn.length === 10) ?? null;
  const isbn13 = doc.isbn?.find((isbn) => isbn.length === 13) ?? null;
  return {
    title: doc.title?.trim() || 'Sin título',
    authors: doc.author_name?.slice(0, 4) ?? ['Autor desconocido'],
    isbn_10: isbn10,
    isbn_13: isbn13,
    open_library_id: doc.key ?? null,
    cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
    published_year: doc.first_publish_year ?? null,
    language: doc.language?.[0] ?? null,
    source: 'open_library'
  };
}

export function normalizeGoogleBook(volume: GoogleVolume): Book {
  const identifiers = volume.volumeInfo?.industryIdentifiers ?? [];
  return {
    title: volume.volumeInfo?.title?.trim() || 'Sin título',
    subtitle: volume.volumeInfo?.subtitle ?? null,
    authors: volume.volumeInfo?.authors?.slice(0, 4) ?? ['Autor desconocido'],
    isbn_10: identifiers.find((item) => item.type === 'ISBN_10')?.identifier ?? null,
    isbn_13: identifiers.find((item) => item.type === 'ISBN_13')?.identifier ?? null,
    google_books_id: volume.id ?? null,
    cover_url: volume.volumeInfo?.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
    description: volume.volumeInfo?.description ?? null,
    published_year: volume.volumeInfo?.publishedDate
      ? Number.parseInt(volume.volumeInfo.publishedDate.slice(0, 4), 10)
      : null,
    language: volume.volumeInfo?.language ?? null,
    source: 'google_books'
  };
}
