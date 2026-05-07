import { router } from 'expo-router';
import { useState } from 'react';
import { AppText, Button, Card, Screen, TextField } from '@/shared/ui/core';
import { PhotoGrid } from '@/features/profile/components';

export default function PhotosOnboarding() {
  const [url, setUrl] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=70');
  return (
    <Screen maxWidth={520}>
      <AppText variant="small">Paso 2 de 6</AppText>
      <Card>
        <AppText variant="title">Fotos</AppText>
        <AppText>Necesitas al menos una imagen visible para aparecer en Descubrir.</AppText>
        <TextField label="URL de foto" value={url} onChangeText={setUrl} />
        <PhotoGrid urls={[url]} />
        <Button title="Siguiente" onPress={() => router.push('/onboarding/reading')} />
      </Card>
    </Screen>
  );
}
