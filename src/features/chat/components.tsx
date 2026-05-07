import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Send, Sparkles } from 'lucide-react-native';
import { AppText, BottomSheet, Button, Chip } from '@/shared/ui/core';
import { useTheme } from '@/shared/theme/ThemeProvider';
import type { Message } from '@/shared/types/domain';
import { suggestionTones } from '@/shared/data/options';

export function ChatBubble({ message, mine }: { message: Message; mine: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[chatStyles.bubble, mine ? chatStyles.mine : chatStyles.theirs, { backgroundColor: mine ? colors.primary : colors.surfaceMuted }]}>
      <AppText color={mine ? colors.primaryText : colors.text}>{message.body}</AppText>
    </View>
  );
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onSuggest
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSuggest: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[chatStyles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Sugerencias" onPress={onSuggest} style={chatStyles.smallButton}>
        <Sparkles size={18} color={colors.primary} />
      </Pressable>
      <TextInput
        accessibilityLabel="Mensaje"
        value={value}
        onChangeText={onChange}
        placeholder="Escribe un mensaje"
        placeholderTextColor={colors.textSubtle}
        style={[chatStyles.input, { color: colors.text }]}
        multiline
      />
      <Pressable accessibilityRole="button" accessibilityLabel="Enviar" onPress={onSend} style={chatStyles.smallButton}>
        <Send size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

export function AiSuggestionPanel({
  visible,
  tone,
  suggestions,
  onTone,
  onPick,
  onClose
}: {
  visible: boolean;
  tone: string;
  suggestions: string[];
  onTone: (tone: string) => void;
  onPick: (text: string) => void;
  onClose: () => void;
}) {
  return (
    <BottomSheet visible={visible} title="Sugerencias" onClose={onClose}>
      <View style={chatStyles.tones}>
        {suggestionTones.map((item) => <Chip key={item} label={item} selected={tone === item} onPress={() => onTone(item)} />)}
      </View>
      {suggestions.map((item) => (
        <Button key={item} title={item} variant="secondary" onPress={() => onPick(item)} />
      ))}
    </BottomSheet>
  );
}

const chatStyles = StyleSheet.create({
  bubble: { maxWidth: '82%', borderRadius: 18, padding: 12, marginVertical: 4 },
  mine: { alignSelf: 'flex-end', borderBottomRightRadius: 6 },
  theirs: { alignSelf: 'flex-start', borderBottomLeftRadius: 6 },
  inputWrap: { borderWidth: 1, borderRadius: 18, padding: 8, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, minHeight: 40, maxHeight: 120, fontSize: 16, paddingVertical: 8 },
  smallButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  tones: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' }
});
