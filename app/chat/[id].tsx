import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AiSuggestionPanel, ChatBubble, MessageInput } from '@/features/chat/components';
import { demoSuggest } from '@/features/ai/api';
import { getMessages, sendMessage } from '@/features/matches/api';
import { getCurrentUser } from '@/shared/data/repository';
import type { Message } from '@/shared/types/domain';
import { AppText, Avatar, ErrorState, LoadingState, Screen } from '@/shared/ui/core';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [body, setBody] = useState('');
  const [assisted, setAssisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sheet, setSheet] = useState(false);
  const [tone, setTone] = useState('Directo');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getCurrentUser(), getMessages(id)])
      .then(([user, data]) => {
        setCurrentUserId(user.profile.id);
        setMessages(data);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo cargar la conversación.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const send = () => {
    if (!body.trim() || !currentUserId) return;
    const message: Message = { id: `local-${Date.now()}`, match_id: id, sender_id: currentUserId, body: body.trim(), was_ai_assisted: assisted, created_at: new Date().toISOString() };
    setMessages((current) => [...current, message]);
    void sendMessage(id, currentUserId, message.body, assisted).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : 'No se pudo enviar el mensaje.');
    });
    setBody('');
    setAssisted(false);
  };

  const suggest = async () => {
    const next = await demoSuggest(tone, messages.slice(-10));
    setSuggestions(next);
    setSheet(true);
  };

  if (loading) return <LoadingState label="Cargando conversación" />;
  if (error) return <ErrorState title={error} retry={load} />;

  return (
    <Screen maxWidth={520} scroll={false} style={chatScreenStyles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={chatScreenStyles.header}>
        <Avatar name="Match" />
        <View>
          <AppText variant="section">Chat</AppText>
          <AppText variant="small">Compatibilidad visible en el perfil</AppText>
        </View>
      </View>
      <View style={chatScreenStyles.messages}>
        {messages.map((message) => <ChatBubble key={message.id} message={message} mine={message.sender_id === currentUserId} />)}
      </View>
      <MessageInput value={body} onChange={setBody} onSend={send} onSuggest={suggest} />
      <AiSuggestionPanel visible={sheet} tone={tone} suggestions={suggestions} onTone={setTone} onClose={() => setSheet(false)} onPick={(text) => { setBody(text); setAssisted(true); setSheet(false); }} />
    </Screen>
  );
}

const chatScreenStyles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  messages: { flex: 1, gap: 4, justifyContent: 'flex-end' }
});
