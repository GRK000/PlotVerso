import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { getAuthErrorMessage, login } from '@/features/auth/api';
import { loginSchema, type LoginInput } from '@/shared/schemas';
import { AppText, GradientButton, Card, Screen, TextField } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [error, setError] = useState('');
  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });
  const onSubmit = handleSubmit(async (values) => {
    setError('');
    const result = await login(values);
    if (result.error) {
      setError(getAuthErrorMessage(result.error.message));
      return;
    }
    router.replace('/(tabs)/discover');
  });
  return (
    <Screen maxWidth={520}>
      <Card style={{ gap: 16 }}>
        <AppText variant="title">Iniciar sesión</AppText>
        <Controller control={control} name="email" render={({ field, fieldState }) => <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="password" render={({ field, fieldState }) => <TextField label="Contraseña" secureTextEntry value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        {error ? <AppText color={colors.danger}>{error}</AppText> : null}
        <GradientButton title="Entrar" disabled={formState.isSubmitting} onPress={onSubmit} />
        <Link href="/register"><AppText color={colors.textMuted}>Crear cuenta</AppText></Link>
      </Card>
    </Screen>
  );
}
