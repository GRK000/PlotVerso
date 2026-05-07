import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { demoUsers, currentDemoUser } from '@/shared/data/demo';
import { scoreCompatibility } from '@/features/discover/matching';
import { CompatibilityBreakdown, CompatibilityBadge } from '@/features/discover/components';
import { blockUser, reportUser } from '@/features/profile/api';
import { AppText, Badge, Button, Card, Screen } from '@/shared/ui/core';
import { BlockButton, PhotoGrid, PublicProfileSummary, ReportModal } from '@/features/profile/components';
import { BookCard } from '@/features/books/components';

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = demoUsers.find((item) => item.profile.id === id) ?? demoUsers[1]!;
  const compatibility = scoreCompatibility(currentDemoUser, user);
  const [reportOpen, setReportOpen] = useState(false);
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
      <BlockButton onBlock={() => void blockUser(currentDemoUser.profile.id, user.profile.id)} />
      <ReportModal visible={reportOpen} onClose={() => setReportOpen(false)} onSubmit={(reason, details) => { void reportUser(currentDemoUser.profile.id, user.profile.id, reason, details); setReportOpen(false); }} />
    </Screen>
  );
}
