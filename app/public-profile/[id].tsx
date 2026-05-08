import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getCurrentUser, getPublicUser } from '@/shared/data/repository';
import type { PublicUser } from '@/shared/types/domain';
import { scoreCompatibility } from '@/features/discover/matching';
import { CompatibilityBreakdown, CompatibilityBadge } from '@/features/discover/components';
import { blockUser, reportUser } from '@/features/profile/api';
import { AppText, Badge, Button, Card, ErrorState, LoadingState, Screen } from '@/shared/ui/core';
import { BlockButton, PhotoGrid, PublicProfileSummary, ReportModal } from '@/features/profile/components';
import { BookCard } from '@/features/books/components';

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getCurrentUser(), getPublicUser(id)])
      .then(([current, publicUser]) => {
        setCurrentUser(current);
        setUser(publicUser);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar el perfil.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return <LoadingState label="Cargando perfil" />;
  if (error || !user || !currentUser) return <ErrorState title={error || 'Perfil no disponible.'} retry={load} />;

  const compatibility = scoreCompatibility(currentUser, user);

  return (
    <Screen maxWidth={720}>
      <PublicProfileSummary user={user} />
      <Card>
        <PhotoGrid urls={user.photos.map((photo) => photo.url)} />
        <CompatibilityBadge score={compatibility.score} />
        <CompatibilityBreakdown result={compatibility} />
      </Card>
      <Card>
        <AppText variant="section">Géneros</AppText>
        {user.reader.favorite_genres.map((genre) => <Badge key={genre} label={genre} tone="accent" />)}
      </Card>
      <Card>
        <AppText variant="section">Biblioteca pública</AppText>
        {user.library.slice(0, 5).map((item) => <BookCard key={item.id} item={item} />)}
      </Card>
      <Card>
        <AppText variant="section">Preguntas</AppText>
        {Object.values(user.reader.open_answers).map((answer) => <AppText key={answer}>{answer}</AppText>)}
      </Card>
      <Button title="Me interesa" />
      <Button title="Reportar" variant="secondary" onPress={() => setReportOpen(true)} />
      <BlockButton onBlock={() => void blockUser(user.profile.id).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo bloquear el perfil.'))} />
      <ReportModal visible={reportOpen} onClose={() => setReportOpen(false)} onSubmit={(reason, details) => { void reportUser(user.profile.id, reason, details).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo enviar el reporte.')); setReportOpen(false); }} />
    </Screen>
  );
}
