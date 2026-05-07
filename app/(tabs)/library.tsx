import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { BookCard } from '@/features/books/components';
import { demoBooks, currentDemoUser } from '@/shared/data/demo';
import type { UserBook } from '@/shared/types/domain';
import { AppText, Button, Card, EmptyState, Screen, TextField } from '@/shared/ui/core';

export default function LibraryScreen() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [library, setLibrary] = useState<UserBook[]>(currentDemoUser.library);
  const columns = width >= 900 ? 3 : width >= 640 ? 2 : 1;
  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return [];
    return demoBooks.filter((book) => `${book.title} ${book.authors.join(' ')}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
  }, [query]);
  const addBook = (bookId: string) => {
    const book = demoBooks.find((item) => item.id === bookId);
    if (!book || library.some((item) => item.book_id === bookId)) return;
    setLibrary([{ id: `local-${bookId}`, user_id: currentDemoUser.profile.id, book_id: bookId, status: 'pending', rating: null, private_note: null, public_comment: null, is_favorite: false, show_on_profile: true, book }, ...library]);
  };
  const section = (title: string, items: UserBook[]) => (
    <View style={{ gap: 12 }}>
      <AppText variant="section">{title}</AppText>
      {items.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {items.map((item) => <View key={item.id} style={{ width: `${100 / columns}%`, maxWidth: columns === 1 ? undefined : 340 }}><BookCard item={item} onPress={() => router.push(`/book/${item.book_id}`)} /></View>)}
        </View>
      ) : <EmptyState title="Sin libros en esta sección" />}
    </View>
  );
  return (
    <Screen maxWidth={1120}>
      <AppText variant="title">Biblioteca</AppText>
      <TextField label="Buscar libros" value={query} onChangeText={setQuery} placeholder="Título, autor o ISBN" />
      {searchResults.length ? (
        <Card>
          <AppText variant="section">Resultados</AppText>
          {searchResults.map((book) => <Button key={book.id} title={`${book.title} · ${book.authors.join(', ')}`} variant="secondary" icon={<Search size={16} />} onPress={() => addBook(book.id!)} />)}
        </Card>
      ) : null}
      {section('Leyendo ahora', library.filter((item) => item.status === 'reading'))}
      {section('Favoritos', library.filter((item) => item.is_favorite || item.status === 'favorite'))}
      {section('Pendientes', library.filter((item) => item.status === 'pending'))}
      {section('Leídos', library.filter((item) => item.status === 'read'))}
      {section('Todos', library)}
    </Screen>
  );
}
