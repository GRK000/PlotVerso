import { AppText, Card, EmptyState, Screen } from '@/shared/ui/core';

export default function SafetyScreen() {
  return (
    <Screen maxWidth={720}>
      <AppText variant="title">Seguridad</AppText>
      <Card>
        <AppText variant="section">Usuarios bloqueados</AppText>
        <EmptyState title="No hay usuarios bloqueados" />
      </Card>
      <Card>
        <AppText variant="section">Reportes</AppText>
        <AppText>Los reportes se guardan en Supabase para revisión interna.</AppText>
      </Card>
    </Screen>
  );
}
