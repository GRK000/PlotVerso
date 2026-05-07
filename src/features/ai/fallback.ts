import type { Book, Message, PublicUser, ReaderProfile } from '@/shared/types/domain';

export function fallbackAnalyze(input: {
  reader: Partial<ReaderProfile>;
  books: Book[];
  answers: Record<string, string>;
}) {
  const answerText = Object.values(input.answers).join(' ').toLowerCase();
  const themes = Array.from(
    new Set([
      ...(input.reader.favorite_genres ?? []).slice(0, 3),
      answerText.includes('memoria') ? 'memoria' : 'vínculos',
      answerText.includes('tensión') ? 'tensión' : 'detalle'
    ])
  );
  return {
    themes,
    tones: ['Directo', 'Curioso'],
    conversation_style: 'Concreta, con preguntas específicas y sin exceso de confianza.',
    ai_summary: `Interés principal en ${themes.slice(0, 3).join(', ')}.`,
    suggested_profile_tags: themes.slice(0, 5)
  };
}

export function fallbackSuggestions({
  current,
  matched,
  tone
}: {
  current: PublicUser;
  matched: PublicUser;
  messages: Message[];
  tone: string;
}) {
  const sharedGenre = current.reader.favorite_genres.find((genre) =>
    matched.reader.favorite_genres.includes(genre)
  );
  const book = matched.library.find((item) => item.show_on_profile)?.book.title;
  const base = sharedGenre ?? book ?? 'tu biblioteca';
  return {
    suggestions: [
      `Me interesa ${base}. ¿Qué buscas normalmente en ese tipo de lectura?`,
      `He visto ${book ? `que tienes ${book}` : 'tu perfil lector'}. ¿Qué te llevó a elegirlo?`,
      tone === 'Más breve'
        ? `¿Qué lectura te está funcionando últimamente?`
        : `¿Hay algún libro reciente que te haya cambiado una opinión o te haya dejado pensando?`
    ]
  };
}
