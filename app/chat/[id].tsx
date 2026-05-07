import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AiSuggestionPanel, ChatBubble, MessageInput } from '@/features/chat/components';
import { demoSuggest } from '@/features/ai/api';
import { getMessages, sendMessage } from '@/features/matches/api';
import { currentDemoUser } from '@/shared/data/demo';
import type { Message } from '@/shared/types/domain';
import { AppText, Avatar, LoadingState, Screen } from '@/shared/ui/core';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [assisted, setAssisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState(false);
  const [tone, setTone] = useState('Directo');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  useEffect(() => {
    getMessages(id).then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, [id]);
  const send = () => {
    if (!body.trim()) return;
    const message: Message = { id: `local-${Date.now()}`, match_id: id, sender_id: currentDemoUser.profile.id, body: body.trim(), was_ai_assisted: assisted, created_at: new Date().toISOString() };
    setMessages([...messages, message]);
    void sendMessage(id, currentDemoUser.profile.id, message.body, assisted);
    setBody('');
    setAssisted(false);
  };
  const suggest = async () => {
    const next = await demoSuggest(tone, messages.slice(-10));
    setSuggestions(next);
    setSheet(true);
  };
  if (loading) return <LoadingState label="Cargando conversación" />;
  return (
    <Screen maxWidth={520} scroll={false} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar name="Match" />
        <View>
          <AppText variant="section">Chat</AppText>
          <AppText variant="small">Compatibilidad visible en el perfil</AppText>
        </View>
      </View>
      <View style={{ flex: 1, gap: 4, justifyContent: 'flex-end' }}>
        {messages.map((message) => <ChatBubble key={message.id} message={message} mine={message.sender_id === currentDemoUser.profile.id} />)}
      </View>
      <MessageInput value={body} onChange={setBody} onSend={send} onSuggest={suggest} />
      <AiSuggestionPanel visible={sheet} tone={tone} suggestions={suggestions} onTone={setTone} onClose={() => setSheet(false)} onPick={(text) => { setBody(text); setAssisted(true); setSheet(false); }} />
    </Screen>
  );
}
