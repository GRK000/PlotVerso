import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
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

const coverGradients = [
  ['#A855F7', '#FF3EB5'],
  ['#00E5FF', '#A855F7'],
  ['#FFB84D', '#FF3EB5'],
  ['#C6FF3D', '#00E5FF'],
  ['#5D4A86', '#211936']
] as const;

function titleHash(title: string) {
  return title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

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
  const dimensions = size === 'lg' ? { width: 170, height: 250 } : size === 'sm' ? { width: 84, height: 126 } : { width: 124, height: 184 };
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
  const gradient = coverGradients[titleHash(book.title) % coverGradients.length]!;
  return (
    <View
      style={[
        bookStyles.cover,
        dimensions,
        {
          backgroundColor: colors.surfaceMuted,
          borderColor: colors.borderStrong,
          shadowColor: colors.glowPrimary,
          shadowOpacity: 0.32,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 }
        },
        Platform.OS === 'web'
          ? ({
              backgroundImage: `radial-gradient(circle at 18% 12%, rgba(255,255,255,0.24), transparent 28%), linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`
            } as ViewStyle)
          : null
      ]}
    >
      <View style={[bookStyles.coverRule, { backgroundColor: colors.accentBright }]} />
      <AppText variant="label" color="#FFFFFF" style={bookStyles.coverTitle} numberOfLines={5}>{book.title}</AppText>
      <AppText variant="small" color="rgba(255,255,255,0.82)" style={bookStyles.coverAuthor} numberOfLines={2}>{book.authors.join(', ')}</AppText>
    </View>
  );
}

export function BookListCard({ item, onPress }: { item: UserBook; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={item.book.title}>
      <Card variant="interactive" style={bookStyles.listCard}>
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

export function BookCoverCard({ item, onPress }: { item: UserBook; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.book.title}
      style={({ pressed, hovered }) => [
        bookStyles.coverCardPressable,
        {
          transform: [{ translateY: pressed ? 2 : hovered ? -4 : 0 }, { scale: pressed ? 0.985 : 1 }],
          shadowColor: item.is_favorite ? colors.glowPink : colors.glowPurple,
          shadowOpacity: item.is_favorite || hovered ? 0.28 : 0.08
        }
      ]}
    >
      <BookCover book={item.book} />
      <View style={bookStyles.coverCardMeta}>
        <AppText variant="label" numberOfLines={2}>{item.book.title}</AppText>
        <AppText variant="small" color={colors.textMuted} numberOfLines={1}>{item.book.authors.join(', ')}</AppText>
        <View style={bookStyles.row}>
          <Badge label={statusLabels[item.status]} tone={item.is_favorite ? 'accent' : 'muted'} />
          {item.rating ? <AppText variant="small" color={colors.amber}>{item.rating}/5</AppText> : null}
        </View>
      </View>
    </Pressable>
  );
}

export const BookCard = BookListCard;

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
  listCard: { flexDirection: 'row', gap: 14, minHeight: 150, borderRadius: 20 },
  cover: { borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'space-between', padding: 12, gap: 8, overflow: 'hidden' },
  coverRule: { width: 28, height: 3, borderRadius: 999, alignSelf: 'flex-start' },
  coverTitle: { textAlign: 'left', alignSelf: 'stretch', fontSize: 16, lineHeight: 20 },
  coverAuthor: { textAlign: 'left', alignSelf: 'stretch' },
  coverCardPressable: {
    width: 150,
    gap: 10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2
  },
  coverCardMeta: { gap: 5 },
  info: { flex: 1, gap: 6, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  wrap: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  stars: { flexDirection: 'row', gap: 6 }
});
