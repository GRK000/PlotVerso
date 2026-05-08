import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { searchBooks } from '@/features/books/api';
import { BookCoverCard, BookListCard } from '@/features/books/components';
import { getCurrentUser, getLibraryForCurrentUser } from '@/shared/data/repository';
import type { Book, UserBook } from '@/shared/types/domain';
import { AppText, Badge, Button, Card, EmptyState, ErrorState, GradientButton, LoadingState, Screen, TextField } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

function toPendingUserBook(book: Book, userId: string): UserBook {
  return {
    id: `local-${book.id ?? book.title}`,
    user_id: userId,
    book_id: book.id ?? book.title,
    status: 'pending',
    rating: null,
    private_note: null,
    public_comment: null,
    is_favorite: false,
    show_on_profile: true,
    book
  };
}

export default function LibraryScreen() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [library, setLibrary] = useState<UserBook[]>([]);
  const [userId, setUserId] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const columns = width >= 980 ? 5 : width >= 760 ? 4 : 2;

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getCurrentUser(), getLibraryForCurrentUser()])
      .then(([user, items]) => {
        setUserId(user.profile.id);
        setLibrary(items);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar la biblioteca.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  useEffect(() => {
    let active = true;
    searchBooks(query)
      .then((books) => {
        if (active) setResults(books.slice(0, 6));
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo buscar libros.'));
    return () => {
      active = false;
    };
  }, [query]);

  const addBook = (book: Book) => {
    const bookId = book.id ?? book.title;
    if (library.some((item) => item.book_id === bookId)) return;
    setLibrary([toPendingUserBook(book, userId), ...library]);
  };

  const stats = useMemo(
    () =>
      [
        ['Leyendo', library.filter((item) => item.status === 'reading').length, colors.accentBright],
        ['Leídos', library.filter((item) => item.status === 'read').length, colors.primaryBright],
        ['Favoritos', library.filter((item) => item.is_favorite || item.status === 'favorite').length, colors.secondaryBright],
        ['Pendientes', library.filter((item) => item.status === 'pending').length, colors.amber]
      ] as const,
    [colors.accentBright, colors.amber, colors.primaryBright, colors.secondaryBright, library]
  );

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

  if (loading) return <LoadingState label="Cargando biblioteca" />;
  if (error) return <ErrorState title={error} retry={load} />;

  return (
    <Screen maxWidth={1180}>
      <Card variant="featured" accent="library" style={libraryStyles.hero}>
        <View style={libraryStyles.heroText}>
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
      {results.length ? (
        <Card variant="elevated">
          <AppText variant="section">Resultados</AppText>
          {results.map((book) => (
            <BookListCard key={book.id ?? book.title} item={toPendingUserBook(book, userId)} onPress={() => addBook(book)} />
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
  heroText: { flex: 1, gap: 8 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { minWidth: 118, flex: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18 },
  section: { gap: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  rail: { gap: 16, paddingRight: 20, paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' }
});
