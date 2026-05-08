import { router, useLocalSearchParams } from 'expo-router';
import { BookCover, BookStatusSelector, RatingStars } from '@/features/books/components';
import { AppText, Button, Card, ErrorState, GradientButton, LoadingState, Screen, TextArea } from '@/shared/ui/core';
import { useEffect, useState } from 'react';
import type { Book, BookStatus, UserBook } from '@/shared/types/domain';
import { getBookForCurrentUser } from '@/shared/data/repository';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<UserBook | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<BookStatus>('pending');
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    getBookForCurrentUser(id)
      .then((result) => {
        if (!result) {
          setError('Libro no encontrado.');
          return;
        }
        setItem(result.item);
        setBook(result.book);
        setStatus(result.item?.status ?? 'pending');
        setRating(result.item?.rating ?? 0);
        setNote(result.item?.private_note ?? '');
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar el libro.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return <LoadingState label="Cargando libro" />;
  if (error || !book) return <ErrorState title={error || 'Libro no disponible.'} retry={load} />;

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
        <GradientButton title="Guardar cambios" onPress={() => router.back()} />
        {item ? <Button title="Eliminar de biblioteca" variant="danger" onPress={() => router.back()} /> : null}
      </Card>
    </Screen>
  );
}
