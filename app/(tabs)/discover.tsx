import { router } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getDiscoverCandidates, recordLike } from '@/features/discover/api';
import { ProfileCard } from '@/features/discover/components';
import type { Candidate } from '@/shared/data/repository';
import { AppText, Button, EmptyState, ErrorState, IconButton, LoadingState, Screen } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<Candidate[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    getDiscoverCandidates()
      .then((data) => {
        setItems(data);
        setIndex(0);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudieron cargar perfiles.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const item = items[index];
  const next = () => setIndex((value) => value + 1);
  const react = (value: 'like' | 'pass') => {
    if (!item) return;
    void recordLike(item.candidate.profile.id, value, item.compatibility.score).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la acción.');
    });
    next();
  };

  if (loading) return <LoadingState label="Buscando perfiles" />;
  if (error) return <ErrorState title={error} retry={load} />;

  return (
    <Screen maxWidth={640}>
      <View style={discoverStyles.header}>
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
          onPass={() => react('pass')}
          onLike={() => react('like')}
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

const discoverStyles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
