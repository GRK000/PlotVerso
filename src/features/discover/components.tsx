import { StyleSheet, View } from 'react-native';
import { AppText, Avatar, Badge, Button, Card } from '@/shared/ui/core';
import { getAge } from '@/shared/lib/date';
import type { CompatibilityResult, PublicUser } from '@/shared/types/domain';
import { BookCover } from '@/features/books/components';

export function CompatibilityBadge({ score }: { score: number }) {
  return <Badge label={`${score}% compatible`} tone={score >= 75 ? 'success' : score >= 55 ? 'accent' : 'warning'} />;
}

export function CompatibilityBreakdown({ result }: { result: CompatibilityResult }) {
  return (
    <View style={discoverStyles.block}>
      {result.explanation.slice(0, 3).map((item) => (
        <AppText key={item} variant="small">{item}</AppText>
      ))}
      {result.contrast_points[0] ? <AppText variant="small">Diferencia relevante: {result.contrast_points[0]}</AppText> : null}
    </View>
  );
}

export function ProfileCard({
  user,
  compatibility,
  onLike,
  onPass,
  onProfile
}: {
  user: PublicUser;
  compatibility: CompatibilityResult;
  onLike?: () => void;
  onPass?: () => void;
  onProfile?: () => void;
}) {
  const profile = user.profile;
  return (
    <Card style={discoverStyles.card}>
      <View style={discoverStyles.header}>
        <Avatar name={profile.display_name} size={72} />
        <View style={discoverStyles.headerText}>
          <AppText variant="section">{profile.display_name}, {getAge(profile.birth_date)}</AppText>
          <AppText variant="small">{[profile.city, profile.country].filter(Boolean).join(', ')}</AppText>
          <CompatibilityBadge score={compatibility.score} />
        </View>
      </View>
      <AppText>{profile.relationship_intent}</AppText>
      <View style={discoverStyles.chips}>
        {user.reader.favorite_genres.slice(0, 4).map((genre) => <Badge key={genre} label={genre} tone="muted" />)}
      </View>
      <View style={discoverStyles.books}>
        {user.library.slice(0, 3).map((item) => <BookCover key={item.id} book={item.book} size="sm" />)}
      </View>
      <CompatibilityBreakdown result={compatibility} />
      <AppText variant="small">Pregunta posible: ¿Qué buscas últimamente en una lectura para que te interese de verdad?</AppText>
      <View style={discoverStyles.actions}>
        <Button title="Pasar" variant="secondary" onPress={onPass} />
        <Button title="Ver perfil" variant="ghost" onPress={onProfile} />
        <Button title="Me interesa" onPress={onLike} />
      </View>
    </Card>
  );
}

const discoverStyles = StyleSheet.create({
  card: { gap: 16 },
  header: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  headerText: { flex: 1, gap: 6 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  books: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  block: { gap: 6 },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' }
});
