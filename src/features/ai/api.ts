import { supabase } from '@/shared/lib/supabase';
import { fallbackSuggestions } from './fallback';
import { currentDemoUser, demoUsers } from '@/shared/data/demo';
import type { Message, PublicUser } from '@/shared/types/domain';

export async function suggestReplies(input: {
  current: PublicUser;
  matched: PublicUser;
  messages: Message[];
  tone: string;
}) {
  const { data, error } = await supabase.functions.invoke('suggest-reply', { body: input });
  if (!error && Array.isArray(data?.suggestions)) return data.suggestions as string[];
  return fallbackSuggestions(input).suggestions;
}

export async function demoSuggest(tone: string, messages: Message[]) {
  return suggestReplies({ current: currentDemoUser, matched: demoUsers[1]!, tone, messages });
}
