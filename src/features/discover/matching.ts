import type { CompatibilityResult, PublicUser, UserBook } from '@/shared/types/domain';

const readingRank = ['Casi nunca', 'Por épocas', 'De vez en cuando', 'Varias veces por semana', 'A diario'];

function normalize(values: string[]) {
  return values.map((value) => value.trim().toLowerCase()).filter(Boolean);
}

function overlap(a: string[], b: string[]) {
  const bSet = new Set(normalize(b));
  return a.filter((item) => bSet.has(item.trim().toLowerCase()));
}

function authors(library: UserBook[]) {
  return Array.from(new Set(library.flatMap((item) => item.book.authors)));
}

function publicTitles(library: UserBook[]) {
  return library.filter((item) => item.show_on_profile).map((item) => item.book.title);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreCompatibility(current: PublicUser, candidate: PublicUser): CompatibilityResult {
  const shared_books = overlap(publicTitles(current.library), publicTitles(candidate.library));
  const shared_authors = overlap(authors(current.library), authors(candidate.library));
  const shared_genres = overlap(current.reader.favorite_genres, candidate.reader.favorite_genres);
  const shared_themes = overlap(current.reader.themes, candidate.reader.themes);
  const sharedLanguages = overlap(current.reader.languages, candidate.reader.languages);
  const sharedTones = overlap(current.reader.tones, candidate.reader.tones);
  const currentFrequency = readingRank.indexOf(current.reader.reading_frequency ?? '');
  const candidateFrequency = readingRank.indexOf(candidate.reader.reading_frequency ?? '');
  const frequencyScore =
    currentFrequency >= 0 && candidateFrequency >= 0
      ? Math.max(0, 5 - Math.abs(currentFrequency - candidateFrequency) * 2)
      : 0;
  const intentScore =
    current.profile.relationship_intent === candidate.profile.relationship_intent ? 10 : 5;
  const diversity =
    shared_genres.length > 0 && candidate.reader.favorite_genres.some((genre) => !current.reader.favorite_genres.includes(genre))
      ? 5
      : 2;
  const activity = candidate.last_active_at
    ? Math.max(0, 5 - Math.floor((Date.now() - new Date(candidate.last_active_at).getTime()) / 86400000))
    : 2;

  const score = clamp(
    Math.min(25, shared_books.length * 7) +
      Math.min(15, shared_authors.length * 5) +
      Math.min(15, shared_genres.length * 5) +
      frequencyScore +
      Math.min(5, sharedLanguages.length * 3) +
      intentScore +
      Math.min(15, shared_themes.length * 5 + sharedTones.length * 3) +
      activity +
      diversity
  );

  const contrast_points = candidate.reader.favorite_genres
    .filter((genre) => !current.reader.favorite_genres.includes(genre))
    .slice(0, 2)
    .map((genre) => `prefiere ${genre.toLowerCase()} y tú sueles leer otros géneros`);

  const explanation = [
    shared_books.length ? `Coincidís en ${shared_books.length} libros.` : 'No hay libros compartidos todavía.',
    shared_authors.length ? `Coincidís en ${shared_authors.length} autores.` : 'Hay margen para descubrir autores nuevos.',
    shared_genres.length ? `Compartís ${shared_genres.join(', ')}.` : 'La afinidad viene más por temas que por género.'
  ];

  return {
    score,
    shared_books,
    shared_authors,
    shared_genres,
    shared_themes,
    contrast_points,
    explanation
  };
}

export function rankCandidates(current: PublicUser, candidates: PublicUser[]) {
  return candidates
    .filter((candidate) => candidate.profile.id !== current.profile.id)
    .filter((candidate) => candidate.profile.onboarding_completed && candidate.photos.length > 0)
    .map((candidate) => ({ candidate, compatibility: scoreCompatibility(current, candidate) }))
    .sort((a, b) => b.compatibility.score - a.compatibility.score);
}
