import { StyleSheet, View } from 'react-native';
import { AppText, Avatar, Badge, Button, Card, GradientButton } from '@/shared/ui/core';
import { getAge } from '@/shared/lib/date';
import type { CompatibilityResult, PublicUser } from '@/shared/types/domain';
import { BookCover } from '@/features/books/components';
import { useTheme } from '@/shared/theme/ThemeProvider';

export function CompatibilityBadge({ score }: { score: number }) {
  return <Badge label={`${score}% · Compatibilidad`} tone={score >= 55 ? 'accent' : 'warning'} />;
}

export function CompatibilityBreakdown({ result }: { result: CompatibilityResult }) {
  const { colors } = useTheme();
  return (
    <View style={discoverStyles.block}>
      <AppText variant="label">Afinidad</AppText>
      {result.explanation.slice(0, 3).map((item) => (
        <AppText key={item} variant="small" color={colors.textMuted}>{item}</AppText>
      ))}
      {result.contrast_points[0] ? (
        <AppText variant="small" color={colors.textMuted}>Diferencia relevante: {result.contrast_points[0]}</AppText>
      ) : null}
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
  const { colors } = useTheme();
  return (
    <Card variant="featured" accent="discover" style={discoverStyles.card}>
      <View style={discoverStyles.header}>
        <View style={[discoverStyles.avatarRing, { borderColor: colors.secondaryBright, shadowColor: colors.glowPink }]}>
          <Avatar url={user.photos[0]?.url} name={profile.display_name} size={92} />
        </View>
        <View style={discoverStyles.headerText}>
          <AppText variant="title">{profile.display_name}, {getAge(profile.birth_date)}</AppText>
          <AppText color={colors.textMuted}>{[profile.city, profile.country].filter(Boolean).join(', ')}</AppText>
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
      <Card variant="glass" style={discoverStyles.prompt}>
        <AppText variant="small" color={colors.textMuted}>Pregunta posible</AppText>
        <AppText>¿Qué buscas últimamente en una lectura para que te interese de verdad?</AppText>
      </Card>
      <View style={discoverStyles.actions}>
        <Button title="Pasar" variant="secondary" onPress={onPass} />
        <Button title="Ver perfil" variant="ghost" onPress={onProfile} />
        <GradientButton title="Me interesa" onPress={onLike} />
      </View>
    </Card>
  );
}

const discoverStyles = StyleSheet.create({
  card: { gap: 18, padding: 20 },
  header: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  avatarRing: { borderWidth: 2, borderRadius: 999, padding: 4, shadowOpacity: 0.3, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  headerText: { flex: 1, gap: 6 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  books: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  block: { gap: 7 },
  prompt: { padding: 14, borderRadius: 18 },
  actions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' }
});
