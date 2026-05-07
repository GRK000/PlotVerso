import { describe, expect, it } from 'vitest';
import { normalizeGoogleBook, normalizeOpenLibrary } from './normalization';

describe('book normalization', () => {
  it('normalizes Open Library results', () => {
    const book = normalizeOpenLibrary({
      key: '/works/OL1W',
      title: 'Nada',
      author_name: ['Carmen Laforet'],
      isbn: ['1234567890', '1234567890123'],
      cover_i: 42,
      first_publish_year: 1945,
      language: ['spa']
    });
    expect(book.title).toBe('Nada');
    expect(book.isbn_13).toBe('1234567890123');
    expect(book.cover_url).toContain('covers.openlibrary.org');
  });

  it('normalizes Google Books results', () => {
    const book = normalizeGoogleBook({
      id: 'g1',
      volumeInfo: {
        title: 'Stoner',
        authors: ['John Williams'],
        publishedDate: '1965-01-01',
        industryIdentifiers: [{ type: 'ISBN_13', identifier: '9780000000000' }]
      }
    });
    expect(book.google_books_id).toBe('g1');
    expect(book.published_year).toBe(1965);
  });
});
