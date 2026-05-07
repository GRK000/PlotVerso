import { supabase } from '@/shared/lib/supabase';
import { currentDemoUser, demoUsers } from '@/shared/data/demo';
import { rankCandidates } from './matching';

export async function getDiscoverCandidates() {
  return rankCandidates(currentDemoUser, demoUsers.slice(1));
}

export async function recordLike(fromUserId: string, toUserId: string, value: 'like' | 'pass', score: number) {
  await supabase.from('likes').upsert({ from_user_id: fromUserId, to_user_id: toUserId, value });
  if (value === 'like') {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('from_user_id', toUserId)
      .eq('to_user_id', fromUserId)
      .eq('value', 'like')
      .maybeSingle();
    if (data) {
      const [a, b] = [fromUserId, toUserId].sort();
      await supabase.from('matches').upsert({
        user_a_id: a,
        user_b_id: b,
        compatibility_score: score,
        status: 'active'
      });
    }
  }
}
