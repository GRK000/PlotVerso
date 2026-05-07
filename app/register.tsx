import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { register } from '@/features/auth/api';
import { registerSchema, type RegisterInput } from '@/shared/schemas';
import { AppText, Button, Card, Screen, TextField } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { control, handleSubmit, setValue, watch, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', acceptTerms: false }
  });
  const acceptTerms = watch('acceptTerms');
  const onSubmit = handleSubmit(async (values) => {
    await register(values);
    router.replace('/onboarding/basic');
  });
  return (
    <Screen maxWidth={520}>
      <Card style={{ gap: 16 }}>
        <AppText variant="title">Crear cuenta</AppText>
        <Controller control={control} name="email" render={({ field, fieldState }) => <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="password" render={({ field, fieldState }) => <TextField label="Contraseña" secureTextEntry value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="confirmPassword" render={({ field, fieldState }) => <TextField label="Confirmar contraseña" secureTextEntry value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Pressable accessibilityRole="checkbox" accessibilityLabel="Aceptar condiciones" onPress={() => setValue('acceptTerms', !acceptTerms, { shouldValidate: true })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: colors.border, backgroundColor: acceptTerms ? colors.primary : colors.surface, alignItems: 'center', justifyContent: 'center' }}>{acceptTerms ? <Check size={16} color={colors.primaryText} /> : null}</View>
          <AppText>Acepto las condiciones de uso.</AppText>
        </Pressable>
        {formState.errors.acceptTerms ? <AppText variant="small" color={colors.danger}>{formState.errors.acceptTerms.message}</AppText> : null}
        <Button title="Continuar" onPress={onSubmit} />
        <Link href="/login"><AppText color={colors.textMuted}>Ya tengo cuenta</AppText></Link>
      </Card>
    </Screen>
  );
}
