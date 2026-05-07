import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { AppText, Badge, Card, Chip } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';
import type { Book, BookStatus, UserBook } from '@/shared/types/domain';

export const statusLabels: Record<BookStatus, string> = {
  read: 'Leído',
  reading: 'Leyendo',
  pending: 'Pendiente',
  abandoned: 'Abandonado',
  favorite: 'Favorito'
};

export function RatingStars({
  value,
  onChange
}: {
  value?: number | null;
  onChange?: (value: number) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={bookStyles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} accessibilityRole="button" accessibilityLabel={`${star} estrellas`} onPress={() => onChange?.(star)}>
          <Star size={22} color={colors.warning} fill={(value ?? 0) >= star ? colors.warning : 'transparent'} />
        </Pressable>
      ))}
    </View>
  );
}

export function BookCover({ book, size = 'md' }: { book: Book; size?: 'sm' | 'md' | 'lg' }) {
  const { colors } = useTheme();
  const dimensions = size === 'lg' ? { width: 150, height: 220 } : size === 'sm' ? { width: 70, height: 104 } : { width: 96, height: 142 };
  if (book.cover_url) {
    return (
      <Image
        source={{ uri: book.cover_url }}
        accessibilityLabel={`${book.title}, ${book.authors.join(', ')}`}
        style={[bookStyles.cover, dimensions, { borderColor: colors.border }]}
        contentFit="cover"
      />
    );
  }
  return (
    <View style={[bookStyles.cover, dimensions, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
      <AppText variant="label" style={{ textAlign: 'center' }} numberOfLines={4}>{book.title}</AppText>
      <AppText variant="small" color={colors.textMuted} style={{ textAlign: 'center' }} numberOfLines={2}>{book.authors.join(', ')}</AppText>
    </View>
  );
}

export function BookCard({ item, onPress }: { item: UserBook; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={item.book.title}>
      <Card style={bookStyles.card}>
        <BookCover book={item.book} size="sm" />
        <View style={bookStyles.info}>
          <AppText variant="label" numberOfLines={2}>{item.book.title}</AppText>
          <AppText variant="small" numberOfLines={1}>{item.book.authors.join(', ')}</AppText>
          <View style={bookStyles.row}>
            <Badge label={statusLabels[item.status]} tone={item.is_favorite ? 'accent' : 'muted'} />
            {item.rating ? <AppText variant="small">{item.rating}/5</AppText> : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export function BookStatusSelector({
  value,
  onChange
}: {
  value: BookStatus;
  onChange: (value: BookStatus) => void;
}) {
  return (
    <View style={bookStyles.wrap}>
      {(Object.keys(statusLabels) as BookStatus[]).map((status) => (
        <Chip key={status} label={statusLabels[status]} selected={value === status} onPress={() => onChange(status)} />
      ))}
    </View>
  );
}

const bookStyles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, minHeight: 138 },
  cover: { borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', padding: 8, gap: 6 },
  info: { flex: 1, gap: 6, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  wrap: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  stars: { flexDirection: 'row', gap: 6 }
});
