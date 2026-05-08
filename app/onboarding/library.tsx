import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { searchBooks } from '@/features/books/api';
import type { Book } from '@/shared/types/domain';
import { AppText, Card, Chip, ErrorState, GradientButton, Screen, TextField } from '@/shared/ui/core';
import { BookCover } from '@/features/books/components';

export default function LibraryOnboarding() {
  const [query, setQuery] = useState('a');
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<Book[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setError('');
    searchBooks(query.length < 2 ? 'la' : query)
      .then((books) => {
        if (!active) return;
        const next = books.slice(0, 8);
        setResults(next);
        setSelected((current) => (current.length ? current : next.slice(0, 5).map((book) => book.id ?? book.title)));
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudieron buscar libros.'));
    return () => {
      active = false;
    };
  }, [query]);

  if (error) return <ErrorState title={error} retry={() => setQuery((value) => `${value} `)} />;

  return (
    <Screen maxWidth={720}>
      <AppText variant="small">Paso 4 de 6</AppText>
      <Card>
        <AppText variant="title">Biblioteca inicial</AppText>
        <TextField label="Buscar libro" value={query} onChangeText={setQuery} placeholder="Título, autor o ISBN" />
        <AppText variant="small">{selected.length}/5 mínimos seleccionados</AppText>
        <View style={libraryOnboardingStyles.results}>
          {results.map((book) => {
            const id = book.id ?? book.title;
            return (
              <View key={id} style={libraryOnboardingStyles.book}>
                <BookCover book={book} />
                <Chip label={selected.includes(id) ? 'Añadido' : 'Añadir'} selected={selected.includes(id)} onPress={() => setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id])} />
              </View>
            );
          })}
        </View>
        <GradientButton title="Siguiente" disabled={selected.length < 5} onPress={() => router.push('/onboarding/questions')} />
      </Card>
    </Screen>
  );
}

const libraryOnboardingStyles = StyleSheet.create({
  results: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  book: { width: 116, gap: 8 }
});
