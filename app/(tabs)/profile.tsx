import { router } from 'expo-router';
import { View } from 'react-native';
import { logout } from '@/features/auth/api';
import { currentDemoUser } from '@/shared/data/demo';
import { AppText, Badge, Button, Card, Screen, ThemeToggle } from '@/shared/ui/core';
import { PhotoGrid, PublicProfileSummary } from '@/features/profile/components';

export default function ProfileScreen() {
  const user = currentDemoUser;
  return (
    <Screen maxWidth={1120}>
      <AppText variant="title">Perfil</AppText>
      <PublicProfileSummary user={user} />
      <Card>
        <AppText variant="section">Fotos</AppText>
        <PhotoGrid urls={user.photos.map((photo) => photo.url)} />
      </Card>
      <Card>
        <AppText variant="section">Preferencias lectoras</AppText>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{user.reader.favorite_genres.map((genre) => <Badge key={genre} label={genre} tone="accent" />)}</View>
      </Card>
      <Card>
        <AppText variant="section">Visibilidad</AppText>
        <AppText>Mostrar edad, ciudad, libros seleccionados y frecuencia de lectura.</AppText>
      </Card>
      <Card>
        <AppText variant="section">Tema</AppText>
        <ThemeToggle />
      </Card>
      <Card>
        <AppText variant="section">Seguridad</AppText>
        <Button title="Reportar problema" variant="secondary" onPress={() => router.push('/settings/safety')} />
      </Card>
      <Card>
        <AppText variant="section">Cuenta</AppText>
        <Button title="Exportar datos" variant="secondary" />
        <Button title="Eliminar cuenta" variant="danger" />
        <Button title="Cerrar sesión" variant="ghost" onPress={() => void logout()} />
      </Card>
    </Screen>
  );
}
