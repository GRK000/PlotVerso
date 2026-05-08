import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { getAuthErrorMessage, register } from '@/features/auth/api';
import { registerSchema, type RegisterInput } from '@/shared/schemas';
import { AppText, Card, GradientButton, Screen, TextField } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const [submitError, setSubmitError] = useState('');
  const { control, handleSubmit, setValue, watch, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', acceptTerms: false }
  });
  const acceptTerms = watch('acceptTerms');
  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('');
    const result = await register(values);
    if (result.error) {
      setSubmitError(getAuthErrorMessage(result.error.message));
      return;
    }
    router.replace('/onboarding/basic');
  });
  return (
    <Screen maxWidth={520}>
      <Card style={{ gap: 16 }}>
        <AppText variant="title">Crear cuenta</AppText>
        <Controller control={control} name="email" render={({ field, fieldState }) => <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="password" render={({ field, fieldState }) => <TextField label="Contraseña" secureTextEntry value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="confirmPassword" render={({ field, fieldState }) => <TextField label="Confirmar contraseña" secureTextEntry value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: acceptTerms }} accessibilityLabel="Aceptar condiciones" onPress={() => setValue('acceptTerms', !acceptTerms, { shouldValidate: true })} style={registerStyles.termsRow}>
          <View style={[registerStyles.checkbox, { borderColor: colors.border, backgroundColor: acceptTerms ? colors.primary : colors.surface }]}>{acceptTerms ? <Check size={16} color={colors.primaryText} /> : null}</View>
          <AppText>Acepto las condiciones de uso.</AppText>
        </Pressable>
        {formState.errors.acceptTerms ? <AppText variant="small" color={colors.danger}>{formState.errors.acceptTerms.message}</AppText> : null}
        {submitError ? <AppText color={colors.danger}>{submitError}</AppText> : null}
        <GradientButton title="Continuar" disabled={formState.isSubmitting} onPress={onSubmit} />
        <Link href="/login"><AppText color={colors.textMuted}>Ya tengo cuenta</AppText></Link>
      </Card>
    </Screen>
  );
}

const registerStyles = StyleSheet.create({
  termsRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }
});
