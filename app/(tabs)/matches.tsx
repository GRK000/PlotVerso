import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { getMatches } from '@/features/matches/api';
import type { Match } from '@/shared/types/domain';
import { AppText, Avatar, Badge, Card, EmptyState, LoadingState, Screen } from '@/shared/ui/core';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMatches().then((data) => {
      setMatches(data);
      setLoading(false);
    });
  }, []);
  if (loading) return <LoadingState label="Cargando matches" />;
  return (
    <Screen maxWidth={720}>
      <AppText variant="title">Matches</AppText>
      <Card>
        <AppText variant="section">Likes pendientes</AppText>
        <AppText variant="small">Los perfiles que te interesan aparecerán aquí cuando haya respuesta.</AppText>
      </Card>
      {matches.length ? matches.map((match) => (
        <Pressable key={match.id} accessibilityRole="button" accessibilityLabel={`Chat con ${match.otherUser?.profile.display_name}`} onPress={() => router.push(`/chat/${match.id}`)}>
          <Card>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Avatar name={match.otherUser?.profile.display_name ?? 'Match'} />
              <View style={{ flex: 1, gap: 4 }}>
                <AppText variant="label">{match.otherUser?.profile.display_name}</AppText>
                <AppText variant="small" numberOfLines={1}>{match.lastMessage?.body}</AppText>
                <AppText variant="small">{match.otherUser?.reader.favorite_genres.slice(0, 2).join(', ')}</AppText>
              </View>
              <Badge label={`${match.compatibility_score}%`} tone="accent" />
            </View>
          </Card>
        </Pressable>
      )) : <EmptyState title="Aún no tienes matches." body="Completa tu biblioteca y revisa perfiles para mejorar recomendaciones." />}
    </Screen>
  );
}
