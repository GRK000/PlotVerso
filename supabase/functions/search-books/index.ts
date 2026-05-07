import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  isbn?: string[];
  cover_i?: number;
  first_publish_year?: number;
  language?: string[];
};

function normalizeOpenLibrary(doc: OpenLibraryDoc) {
  return {
    title: doc.title || 'Sin título',
    authors: doc.author_name?.slice(0, 4) ?? ['Autor desconocido'],
    isbn_10: doc.isbn?.find((isbn) => isbn.length === 10) ?? null,
    isbn_13: doc.isbn?.find((isbn) => isbn.length === 13) ?? null,
    open_library_id: doc.key ?? null,
    cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
    published_year: doc.first_publish_year ?? null,
    language: doc.language?.[0] ?? null,
    source: 'open_library'
  };
}

serve(async (req) => {
  const { query } = await req.json().catch(() => ({ query: '' }));
  if (!query || String(query).length < 2) return Response.json({ books: [] });
  try {
    const open = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
    const openJson = await open.json();
    const books = (openJson.docs ?? []).slice(0, 10).map(normalizeOpenLibrary);
    if (books.length >= 3) return Response.json({ books });
  } catch {
    // deterministic fallback below
  }
  return Response.json({
    books: [
      { title: query, authors: ['Autor desconocido'], source: 'fallback', published_year: null, cover_url: null }
    ]
  });
});
