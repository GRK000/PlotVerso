import { router } from 'expo-router';
import { currentDemoUser } from '@/shared/data/demo';
import { AppText, Badge, Card, GradientButton, Screen } from '@/shared/ui/core';

export default function ResultOnboarding() {
  return (
    <Screen maxWidth={520}>
      <AppText variant="small">Paso 6 de 6</AppText>
      <Card>
        <AppText variant="title">Perfil lector</AppText>
        <AppText>{currentDemoUser.reader.ai_summary}</AppText>
        <AppText variant="section">Géneros principales</AppText>
        {currentDemoUser.reader.favorite_genres.map((genre) => <Badge key={genre} label={genre} tone="accent" />)}
        <AppText variant="section">Temas</AppText>
        {currentDemoUser.reader.themes.map((theme) => <Badge key={theme} label={theme} />)}
        <AppText variant="section">Estilo de conversación</AppText>
        <AppText>{currentDemoUser.reader.conversation_style}</AppText>
        <AppText variant="section">Libros públicos</AppText>
        {currentDemoUser.library.slice(0, 5).map((item) => <AppText key={item.id}>{item.book.title}</AppText>)}
        <GradientButton title="Ir a descubrir" onPress={() => router.replace('/(tabs)/discover')} />
      </Card>
    </Screen>
  );
}
