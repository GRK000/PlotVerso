import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { BookCoverCard, BookListCard } from '@/features/books/components';
import { currentDemoUser, demoBooks } from '@/shared/data/demo';
import type { UserBook } from '@/shared/types/domain';
import { AppText, Badge, Button, Card, EmptyState, GradientButton, Screen, TextField } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

export default function LibraryScreen() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [library, setLibrary] = useState<UserBook[]>(currentDemoUser.library);
  const columns = width >= 980 ? 5 : width >= 760 ? 4 : 2;
  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return [];
    return demoBooks
      .filter((book) => `${book.title} ${book.authors.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }, [query]);
  const addBook = (bookId: string) => {
    const book = demoBooks.find((item) => item.id === bookId);
    if (!book || library.some((item) => item.book_id === bookId)) return;
    setLibrary([
      {
        id: `local-${bookId}`,
        user_id: currentDemoUser.profile.id,
        book_id: bookId,
        status: 'pending',
        rating: null,
        private_note: null,
        public_comment: null,
        is_favorite: false,
        show_on_profile: true,
        book
      },
      ...library
    ]);
  };
  const stats = [
    ['Leyendo', library.filter((item) => item.status === 'reading').length, colors.accentBright],
    ['Leídos', library.filter((item) => item.status === 'read').length, colors.primaryBright],
    ['Favoritos', library.filter((item) => item.is_favorite || item.status === 'favorite').length, colors.secondaryBright],
    ['Pendientes', library.filter((item) => item.status === 'pending').length, colors.amber]
  ] as const;
  const section = (title: string, items: UserBook[], featured = false) => (
    <View style={libraryStyles.section}>
      <View style={libraryStyles.sectionHeader}>
        <View>
          <AppText variant="section">{title} · {items.length}</AppText>
          <AppText variant="small" color={colors.textMuted}>Biblioteca visual</AppText>
        </View>
        <Badge label="Ver todo" tone={featured ? 'accent' : 'muted'} />
      </View>
      {items.length ? (
        width < 700 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={libraryStyles.rail}>
            {items.map((item) => (
              <BookCoverCard key={item.id} item={item} onPress={() => router.push(`/book/${item.book_id}`)} />
            ))}
          </ScrollView>
        ) : (
          <View style={libraryStyles.grid}>
            {items.map((item) => (
              <View key={item.id} style={{ width: `${100 / columns}%`, paddingRight: 14, paddingBottom: 18 }}>
                <BookCoverCard item={item} onPress={() => router.push(`/book/${item.book_id}`)} />
              </View>
            ))}
          </View>
        )
      ) : (
        <EmptyState title="Sin libros en esta sección" />
      )}
    </View>
  );
  return (
    <Screen maxWidth={1180}>
      <Card variant="featured" accent="library" style={libraryStyles.hero}>
        <View style={{ flex: 1, gap: 8 }}>
          <AppText variant="title">Biblioteca</AppText>
          <AppText color={colors.textMuted}>Organiza tus lecturas y decide qué forma parte de tu perfil público.</AppText>
        </View>
        <GradientButton title="Añadir lectura" />
      </Card>
      <TextField label="Buscar libros" value={query} onChangeText={setQuery} placeholder="Título, autor o ISBN" />
      <View style={libraryStyles.statsRow}>
        {stats.map(([label, value, color]) => (
          <Card key={label} variant="glass" style={libraryStyles.statCard}>
            <AppText variant="small" color={colors.textMuted}>{label}</AppText>
            <AppText variant="section" color={color}>{value}</AppText>
          </Card>
        ))}
      </View>
      {searchResults.length ? (
        <Card variant="elevated">
          <AppText variant="section">Resultados</AppText>
          {searchResults.map((book) => (
            <BookListCard
              key={book.id}
              item={{
                id: `result-${book.id}`,
                user_id: currentDemoUser.profile.id,
                book_id: book.id!,
                status: 'pending',
                rating: null,
                private_note: null,
                public_comment: null,
                is_favorite: false,
                show_on_profile: true,
                book
              }}
              onPress={() => addBook(book.id!)}
            />
          ))}
          <Button title="Buscar en fuentes externas" variant="secondary" icon={<Search size={16} />} />
        </Card>
      ) : null}
      {section('Leyendo ahora', library.filter((item) => item.status === 'reading'), true)}
      {section('Favoritos', library.filter((item) => item.is_favorite || item.status === 'favorite'), true)}
      {section('Pendientes', library.filter((item) => item.status === 'pending'))}
      {section('Leídos', library.filter((item) => item.status === 'read'))}
      {section('Todos', library)}
    </Screen>
  );
}

const libraryStyles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { minWidth: 118, flex: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18 },
  section: { gap: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  rail: { gap: 16, paddingRight: 20, paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' }
});
