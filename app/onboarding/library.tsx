import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { demoBooks } from '@/shared/data/demo';
import { AppText, Card, Chip, GradientButton, Screen, TextField } from '@/shared/ui/core';
import { BookCover } from '@/features/books/components';

export default function LibraryOnboarding() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(demoBooks.slice(0, 5).map((book) => book.id!));
  const results = useMemo(() => demoBooks.filter((book) => `${book.title} ${book.authors.join(' ')}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8), [query]);
  return (
    <Screen maxWidth={720}>
      <AppText variant="small">Paso 4 de 6</AppText>
      <Card>
        <AppText variant="title">Biblioteca inicial</AppText>
        <TextField label="Buscar libro" value={query} onChangeText={setQuery} placeholder="Título, autor o ISBN" />
        <AppText variant="small">{selected.length}/5 mínimos seleccionados</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {results.map((book) => (
            <View key={book.id} style={{ width: 116, gap: 8 }}>
              <BookCover book={book} />
              <Chip label={selected.includes(book.id!) ? 'Añadido' : 'Añadir'} selected={selected.includes(book.id!)} onPress={() => setSelected(selected.includes(book.id!) ? selected.filter((id) => id !== book.id) : [...selected, book.id!])} />
            </View>
          ))}
        </View>
        <GradientButton title="Siguiente" disabled={selected.length < 5} onPress={() => router.push('/onboarding/questions')} />
      </Card>
    </Screen>
  );
}
