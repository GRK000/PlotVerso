import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/shared/data/repository';
import type { PublicUser } from '@/shared/types/domain';
import { AppText, Badge, Card, ErrorState, GradientButton, LoadingState, Screen } from '@/shared/ui/core';

export default function ResultOnboarding() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    getCurrentUser()
      .then(setUser)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo generar el perfil lector.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingState label="Preparando perfil lector" />;
  if (error || !user) return <ErrorState title={error || 'Perfil lector no disponible.'} retry={load} />;

  return (
    <Screen maxWidth={520}>
      <AppText variant="small">Paso 6 de 6</AppText>
      <Card>
        <AppText variant="title">Perfil lector</AppText>
        <AppText>{user.reader.ai_summary}</AppText>
        <AppText variant="section">Géneros principales</AppText>
        {user.reader.favorite_genres.map((genre) => <Badge key={genre} label={genre} tone="accent" />)}
        <AppText variant="section">Temas</AppText>
        {user.reader.themes.map((theme) => <Badge key={theme} label={theme} />)}
        <AppText variant="section">Estilo de conversación</AppText>
        <AppText>{user.reader.conversation_style}</AppText>
        <AppText variant="section">Libros públicos</AppText>
        {user.library.slice(0, 5).map((item) => <AppText key={item.id}>{item.book.title}</AppText>)}
        <GradientButton title="Ir a descubrir" onPress={() => router.replace('/(tabs)/discover')} />
      </Card>
    </Screen>
  );
}
