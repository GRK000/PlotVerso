import { router, useLocalSearchParams } from 'expo-router';
import { currentDemoUser, demoBooks } from '@/shared/data/demo';
import { BookCover, BookStatusSelector, RatingStars } from '@/features/books/components';
import { AppText, Button, Card, Screen, TextArea } from '@/shared/ui/core';
import { useState } from 'react';
import type { BookStatus } from '@/shared/types/domain';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = currentDemoUser.library.find((entry) => entry.book_id === id);
  const book = item?.book ?? demoBooks.find((entry) => entry.id === id) ?? demoBooks[0]!;
  const [status, setStatus] = useState<BookStatus>(item?.status ?? 'pending');
  const [rating, setRating] = useState(item?.rating ?? 0);
  const [note, setNote] = useState(item?.private_note ?? '');
  return (
    <Screen maxWidth={720}>
      <Card>
        <BookCover book={book} size="lg" />
        <AppText variant="title">{book.title}</AppText>
        <AppText>{book.authors.join(', ')} · {book.published_year}</AppText>
        <AppText>{book.description || 'Metadatos normalizados disponibles en la biblioteca local.'}</AppText>
        <BookStatusSelector value={status} onChange={setStatus} />
        <RatingStars value={rating} onChange={setRating} />
        <TextArea label="Nota privada" value={note} onChangeText={setNote} />
        <Button title="Guardar cambios" onPress={() => router.back()} />
        <Button title="Eliminar de biblioteca" variant="danger" onPress={() => router.back()} />
      </Card>
    </Screen>
  );
}
