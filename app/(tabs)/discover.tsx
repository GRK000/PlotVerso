import { router } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getDiscoverCandidates, recordLike } from '@/features/discover/api';
import { ProfileCard } from '@/features/discover/components';
import { currentDemoUser } from '@/shared/data/demo';
import type { CompatibilityResult, PublicUser } from '@/shared/types/domain';
import { AppText, Button, EmptyState, IconButton, LoadingState, Screen } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

type Candidate = { candidate: PublicUser; compatibility: CompatibilityResult };

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<Candidate[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDiscoverCandidates().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);
  const item = items[index];
  const next = () => setIndex((value) => value + 1);
  if (loading) return <LoadingState label="Buscando perfiles" />;
  return (
    <Screen maxWidth={640}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="title">Descubrir</AppText>
        <IconButton label="Filtros">
          <SlidersHorizontal size={20} color={colors.text} />
        </IconButton>
      </View>
      {item ? (
        <ProfileCard
          user={item.candidate}
          compatibility={item.compatibility}
          onProfile={() => router.push(`/public-profile/${item.candidate.profile.id}`)}
          onPass={() => {
            void recordLike(currentDemoUser.profile.id, item.candidate.profile.id, 'pass', item.compatibility.score);
            next();
          }}
          onLike={() => {
            void recordLike(currentDemoUser.profile.id, item.candidate.profile.id, 'like', item.compatibility.score);
            next();
          }}
        />
      ) : (
        <EmptyState
          title="No hay suficientes perfiles compatibles todavía."
          body="Puedes ampliar filtros, revisar tu biblioteca o ver perfiles recientes."
          action={<Button title="Ver perfiles recientes" onPress={() => setIndex(0)} />}
        />
      )}
    </Screen>
  );
}
