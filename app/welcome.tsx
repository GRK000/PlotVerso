import { router } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { View } from 'react-native';
import { AppText, Button, Card, Screen, ThemeToggle } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  return (
    <Screen maxWidth={520}>
      <View style={{ alignItems: 'flex-end' }}>
        <ThemeToggle />
      </View>
      <Card style={{ gap: 22, padding: 24 }}>
        <BookOpen size={34} color={colors.primary} />
        <View style={{ gap: 8 }}>
          <AppText variant="title">PlotVerso</AppText>
          <AppText color={colors.textMuted}>Citas y conversaciones a partir de gustos literarios.</AppText>
        </View>
        <Button title="Crear cuenta" onPress={() => router.push('/register')} />
        <Button title="Iniciar sesión" variant="secondary" onPress={() => router.push('/login')} />
      </Card>
    </Screen>
  );
}
