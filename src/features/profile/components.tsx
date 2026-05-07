import { StyleSheet, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import { AppText, Avatar, BottomSheet, Button, Card, TextArea } from '@/shared/ui/core';
import type { PublicUser } from '@/shared/types/domain';
import { useState } from 'react';

export function PhotoGrid({ urls }: { urls: string[] }) {
  return (
    <View style={profileStyles.photos}>
      {urls.map((url, index) => <Avatar key={url || index} url={url} name={`Foto ${index + 1}`} size={96} />)}
    </View>
  );
}

export function ReportModal({
  visible,
  onClose,
  onSubmit
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}) {
  const [details, setDetails] = useState('');
  return (
    <BottomSheet visible={visible} title="Reportar perfil" onClose={onClose}>
      <TextArea label="Detalles" value={details} onChangeText={setDetails} placeholder="Describe el problema" />
      <Button title="Enviar reporte" variant="danger" onPress={() => onSubmit('safety', details)} />
    </BottomSheet>
  );
}

export function BlockButton({ onBlock }: { onBlock: () => void }) {
  return <Button title="Bloquear usuario" variant="danger" icon={<Shield size={18} color="#B42318" />} onPress={onBlock} />;
}

export function PublicProfileSummary({ user }: { user: PublicUser }) {
  return (
    <Card>
      <View style={profileStyles.row}>
        <Avatar name={user.profile.display_name} size={64} />
        <View style={{ flex: 1 }}>
          <AppText variant="section">{user.profile.display_name}</AppText>
          <AppText variant="small">{[user.profile.city, user.profile.country].filter(Boolean).join(', ')}</AppText>
        </View>
      </View>
      <AppText>{user.profile.bio || 'Perfil lector completo y biblioteca pública visible.'}</AppText>
    </Card>
  );
}

const profileStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  photos: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' }
});
