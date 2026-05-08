import { router } from 'expo-router';
import { View } from 'react-native';
import { logout } from '@/features/auth/api';
import { currentDemoUser } from '@/shared/data/demo';
import { AppText, Badge, Button, Card, Screen, ThemeToggle } from '@/shared/ui/core';
import { PhotoGrid, ProfileHeroCard } from '@/features/profile/components';

export default function ProfileScreen() {
  const user = currentDemoUser;
  return (
    <Screen maxWidth={1180}>
      <ProfileHeroCard user={user} />
      <Card variant="elevated">
        <AppText variant="section">Fotos</AppText>
        <PhotoGrid urls={user.photos.map((photo) => photo.url)} />
      </Card>
      <Card variant="featured" accent="profile">
        <AppText variant="section">Perfil lector</AppText>
        <AppText>{user.reader.ai_summary}</AppText>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {user.reader.themes.map((theme) => <Badge key={theme} label={theme} tone="accent" />)}
        </View>
      </Card>
      <Card variant="glass">
        <AppText variant="section">Estantería pública</AppText>
        <AppText>Libros visibles, comentarios públicos y favoritos destacados.</AppText>
        <Button title="Editar visibilidad" variant="secondary" />
      </Card>
      <Card variant="glass">
        <AppText variant="section">Visibilidad</AppText>
        <AppText>Mostrar edad, ciudad, libros seleccionados y frecuencia de lectura.</AppText>
      </Card>
      <Card variant="glass">
        <AppText variant="section">Tema</AppText>
        <ThemeToggle />
      </Card>
      <Card variant="glass">
        <AppText variant="section">Seguridad</AppText>
        <Button title="Reportar problema" variant="secondary" onPress={() => router.push('/settings/safety')} />
      </Card>
      <Card variant="glass">
        <AppText variant="section">Cuenta</AppText>
        <Button title="Exportar datos" variant="secondary" />
        <Button title="Eliminar cuenta" variant="danger" />
        <Button title="Cerrar sesión" variant="ghost" onPress={() => void logout()} />
      </Card>
    </Screen>
  );
}
