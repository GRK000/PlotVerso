import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View } from 'react-native';
import { basicProfileSchema, relationshipIntentOptions, type BasicProfileInput } from '@/shared/schemas';
import { genderOptions } from '@/shared/data/options';
import { AppText, Card, Chip, GradientButton, Screen, Select, TextField } from '@/shared/ui/core';

export default function BasicOnboarding() {
  const { control, handleSubmit, setValue, watch } = useForm<BasicProfileInput>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: { display_name: '', birth_date: '', city: '', country: 'España', gender: '', interested_in: [], relationship_intent: 'Citas sin presión' }
  });
  const interested = watch('interested_in');
  return (
    <Screen maxWidth={520}>
      <AppText variant="small">Paso 1 de 6</AppText>
      <Card>
        <AppText variant="title">Perfil básico</AppText>
        <Controller control={control} name="display_name" render={({ field, fieldState }) => <TextField label="Nombre visible" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="birth_date" render={({ field, fieldState }) => <TextField label="Fecha de nacimiento" placeholder="1994-05-18" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="city" render={({ field, fieldState }) => <TextField label="Ciudad" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="country" render={({ field, fieldState }) => <TextField label="País" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />} />
        <Controller control={control} name="gender" render={({ field, fieldState }) => <Select label="Género" value={field.value} options={genderOptions} onChange={field.onChange} error={fieldState.error?.message} />} />
        <AppText variant="label">Te interesa conocer</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {genderOptions.slice(0, 4).map((item) => <Chip key={item} label={item} selected={interested.includes(item)} onPress={() => setValue('interested_in', interested.includes(item) ? interested.filter((x) => x !== item) : [...interested, item], { shouldValidate: true })} />)}
        </View>
        <Controller control={control} name="relationship_intent" render={({ field, fieldState }) => <Select label="Intención" value={field.value} options={relationshipIntentOptions} onChange={field.onChange} error={fieldState.error?.message} />} />
        <GradientButton title="Siguiente" onPress={handleSubmit(() => router.push('/onboarding/photos'))} />
      </Card>
    </Screen>
  );
}
