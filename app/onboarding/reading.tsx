import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { genreOptions, languageOptions } from '@/shared/data/options';
import { preferredFormatOptions, readingFrequencyOptions } from '@/shared/schemas';
import { AppText, Card, Chip, GradientButton, Screen, Select } from '@/shared/ui/core';

export default function ReadingOnboarding() {
  const [frequency, setFrequency] = useState('Varias veces por semana');
  const [formats, setFormats] = useState<string[]>(['Papel']);
  const [languages, setLanguages] = useState<string[]>(['Español']);
  const [genres, setGenres] = useState<string[]>(['Ficción literaria']);
  const toggle = (list: string[], value: string, setter: (items: string[]) => void) => setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  return (
    <Screen maxWidth={520}>
      <AppText variant="small">Paso 3 de 6</AppText>
      <Card>
        <AppText variant="title">Hábitos de lectura</AppText>
        <Select label="Frecuencia" value={frequency} options={readingFrequencyOptions} onChange={setFrequency} />
        <AppText variant="label">Formatos</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{preferredFormatOptions.map((item) => <Chip key={item} label={item} selected={formats.includes(item)} onPress={() => toggle(formats, item, setFormats)} />)}</View>
        <AppText variant="label">Idiomas</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{languageOptions.map((item) => <Chip key={item} label={item} selected={languages.includes(item)} onPress={() => toggle(languages, item, setLanguages)} />)}</View>
        <AppText variant="label">Géneros favoritos</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{genreOptions.map((item) => <Chip key={item} label={item} selected={genres.includes(item)} onPress={() => toggle(genres, item, setGenres)} />)}</View>
        <GradientButton title="Siguiente" onPress={() => router.push('/onboarding/library')} />
      </Card>
    </Screen>
  );
}
