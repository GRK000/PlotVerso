import { router } from 'expo-router';
import { useState } from 'react';
import { AppText, Button, Card, Screen, TextArea } from '@/shared/ui/core';

const questions = [
  ['tasteBook', '¿Qué libro recomendarías para entender mejor tus gustos?'],
  ['overratedBook', '¿Qué libro no te gustó aunque suele recomendarse mucho?'],
  ['hook', '¿Qué tipo de historia te engancha rápido?'],
  ['conversationLoss', '¿Qué te hace perder interés en una conversación?']
] as const;

export default function QuestionsOnboarding() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const ready = questions.every(([key]) => (answers[key] ?? '').trim().length > 1);
  return (
    <Screen maxWidth={520}>
      <AppText variant="small">Paso 5 de 6</AppText>
      <Card>
        <AppText variant="title">Preguntas abiertas</AppText>
        {questions.map(([key, label]) => <TextArea key={key} label={label} value={answers[key] ?? ''} onChangeText={(text) => setAnswers({ ...answers, [key]: text })} />)}
        <Button title="Analizar perfil" disabled={!ready} onPress={() => router.push('/onboarding/result')} />
      </Card>
    </Screen>
  );
}
