import { currentDemoUser, demoUsers } from '@/shared/data/demo';
import { scoreCompatibility } from '@/features/discover/matching';
import type { Match, Message } from '@/shared/types/domain';
import { supabase } from '@/shared/lib/supabase';

export async function getMatches(): Promise<Match[]> {
  return demoUsers.slice(1, 4).map((user, index) => ({
    id: `m-${index + 1}`,
    user_a_id: currentDemoUser.profile.id,
    user_b_id: user.profile.id,
    compatibility_score: scoreCompatibility(currentDemoUser, user).score,
    status: 'active',
    created_at: new Date().toISOString(),
    otherUser: user,
    lastMessage: {
      id: `msg-${index}`,
      match_id: `m-${index + 1}`,
      sender_id: user.profile.id,
      body: index === 0 ? 'Me interesa lo que comentas sobre novela psicológica.' : 'Tengo pendiente revisar tu biblioteca.',
      was_ai_assisted: false,
      created_at: new Date().toISOString()
    }
  }));
}

export async function getMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase.from('messages').select('*').eq('match_id', matchId).order('created_at');
  if (!error && data) return data;
  return [
    {
      id: `${matchId}-seed-1`,
      match_id: matchId,
      sender_id: 'u2',
      body: 'He visto que también lees ensayo narrativo.',
      was_ai_assisted: false,
      created_at: new Date(Date.now() - 60000).toISOString()
    }
  ];
}

export async function sendMessage(matchId: string, senderId: string, body: string, wasAiAssisted: boolean) {
  return supabase.from('messages').insert({ match_id: matchId, sender_id: senderId, body, was_ai_assisted: wasAiAssisted });
}
