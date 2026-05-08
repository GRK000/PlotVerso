import { StyleSheet, View } from 'react-native';
import { Plus, Shield } from 'lucide-react-native';
import { AppText, Avatar, Badge, BottomSheet, Button, Card, TextArea } from '@/shared/ui/core';
import type { PublicUser } from '@/shared/types/domain';
import { useState } from 'react';
import { useTheme } from '@/shared/theme/ThemeProvider';

export function PhotoGrid({ urls }: { urls: string[] }) {
  const { colors } = useTheme();
  const slots = Array.from({ length: 6 }, (_, index) => urls[index]);
  return (
    <View style={profileStyles.photos}>
      {slots.map((url, index) => (
        <View
          key={url ?? `empty-${index}`}
          style={[
            profileStyles.photoSlot,
            index === 0 ? profileStyles.photoSlotLarge : null,
            { borderColor: url ? colors.borderStrong : colors.border, backgroundColor: colors.surface2 }
          ]}
        >
          {url ? (
            <Avatar url={url} name={`Foto ${index + 1}`} size={index === 0 ? 138 : 76} />
          ) : (
            <Plus size={22} color={colors.textSubtle} />
          )}
        </View>
      ))}
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

export function ProfileHeroCard({ user }: { user: PublicUser }) {
  const { colors } = useTheme();
  return (
    <Card variant="featured" accent="profile" style={profileStyles.hero}>
      <View style={[profileStyles.heroRing, { borderColor: colors.accentBright, shadowColor: colors.glowCyan }]}>
        <Avatar url={user.photos[0]?.url} name={user.profile.display_name} size={112} />
      </View>
      <View style={profileStyles.heroBody}>
        <AppText variant="title">{user.profile.display_name}</AppText>
        <AppText color={colors.textMuted}>{[user.profile.city, user.profile.country].filter(Boolean).join(', ')}</AppText>
        <AppText>{user.profile.bio || 'Perfil lector completo y biblioteca pública visible.'}</AppText>
        <View style={profileStyles.tags}>
          {user.reader.favorite_genres.slice(0, 4).map((genre) => (
            <Badge key={genre} label={genre} tone="accent" />
          ))}
        </View>
      </View>
      <Button title="Editar" variant="secondary" />
    </Card>
  );
}

const profileStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  photos: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  photoSlot: { width: 86, height: 86, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoSlotLarge: { width: 150, height: 150 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 18, flexWrap: 'wrap' },
  heroRing: { borderWidth: 2, borderRadius: 999, padding: 4, shadowOpacity: 0.28, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  heroBody: { flex: 1, minWidth: 220, gap: 8 },
  tags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' }
});
