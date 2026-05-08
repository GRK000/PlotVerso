import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getMatches } from '@/features/matches/api';
import type { Match } from '@/shared/types/domain';
import { AppText, Avatar, Badge, Card, Chip, EmptyState, ErrorState, LoadingState, Screen } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

export default function MatchesScreen() {
  const { colors } = useTheme();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = () => {
    setLoading(true);
    setError('');
    getMatches()
      .then(setMatches)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los matches.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const average = useMemo(
    () => Math.round(matches.reduce((sum, match) => sum + match.compatibility_score, 0) / Math.max(1, matches.length)),
    [matches]
  );
  if (loading) return <LoadingState label="Cargando matches" />;
  if (error) return <ErrorState title={error} retry={load} />;
  return (
    <Screen maxWidth={900}>
      <Card variant="featured" accent="matches" style={matchStyles.summary}>
        <View>
          <AppText variant="title">Matches</AppText>
          <AppText color={colors.textMuted}>Conversaciones activas y afinidades recientes.</AppText>
        </View>
        <View style={matchStyles.summaryStats}>
          <View>
            <AppText variant="small" color={colors.textMuted}>Activos</AppText>
            <AppText variant="section" color={colors.secondaryBright}>{matches.length}</AppText>
          </View>
          <View>
            <AppText variant="small" color={colors.textMuted}>Pendientes</AppText>
            <AppText variant="section" color={colors.primaryBright}>3</AppText>
          </View>
          <View>
            <AppText variant="small" color={colors.textMuted}>Afinidad media</AppText>
            <AppText variant="section" color={colors.accentBright}>{average}%</AppText>
          </View>
        </View>
      </Card>
      {matches.length ? (
        matches.map((match, index) => (
          <Pressable
            key={match.id}
            accessibilityRole="button"
            accessibilityLabel={`Chat con ${match.otherUser?.profile.display_name}`}
            onPress={() => router.push(`/chat/${match.id}`)}
            style={({ pressed, hovered }) => [
              {
                transform: [{ translateY: pressed ? 1 : hovered ? -3 : 0 }],
                shadowColor: colors.glowPink,
                shadowOpacity: hovered ? 0.2 : 0
              }
            ]}
          >
            <Card variant="interactive" style={matchStyles.matchCard}>
              <View style={matchStyles.avatarWrap}>
                <View style={[matchStyles.avatarRing, { borderColor: index === 0 ? colors.secondaryBright : colors.borderStrong }]}>
                  <Avatar
                    url={match.otherUser?.photos[0]?.url}
                    name={match.otherUser?.profile.display_name ?? 'Match'}
                    size={68}
                  />
                </View>
                <Badge label={index === 0 ? 'Nuevo' : index === 1 ? 'Activo' : 'Pendiente'} tone={index === 0 ? 'accent' : 'muted'} />
              </View>
              <View style={matchStyles.matchBody}>
                <View style={matchStyles.matchTop}>
                  <View style={{ flex: 1 }}>
                    <AppText variant="section">{match.otherUser?.profile.display_name}</AppText>
                    <AppText variant="small" color={colors.textMuted} numberOfLines={1}>
                      {match.lastMessage?.body}
                    </AppText>
                  </View>
                  <Badge label={`${match.compatibility_score}%`} tone="accent" />
                </View>
                <View style={matchStyles.chips}>
                  {match.otherUser?.reader.favorite_genres.slice(0, 3).map((genre) => (
                    <Chip key={genre} label={genre} selected />
                  ))}
                </View>
                <AppText variant="small" color={colors.textSubtle}>
                  {match.otherUser?.library.slice(0, 2).map((item) => item.book.title).join(' · ')}
                </AppText>
              </View>
            </Card>
          </Pressable>
        ))
      ) : (
        <EmptyState title="Aún no tienes matches." body="Completa tu biblioteca y revisa perfiles para mejorar recomendaciones." />
      )}
    </Screen>
  );
}

const matchStyles = StyleSheet.create({
  summary: { gap: 18 },
  summaryStats: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' },
  matchCard: { flexDirection: 'row', gap: 16, alignItems: 'center', padding: 16 },
  avatarWrap: { alignItems: 'center', gap: 8 },
  avatarRing: { borderWidth: 2, borderRadius: 999, padding: 3 },
  matchBody: { flex: 1, gap: 10 },
  matchTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' }
});
