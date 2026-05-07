import { supabase } from '@/shared/lib/supabase';

export async function blockUser(blockerId: string, blockedId: string) {
  return supabase.from('blocks').upsert({ blocker_id: blockerId, blocked_id: blockedId });
}

export async function reportUser(reporterId: string, reportedUserId: string, reason: string, details?: string) {
  return supabase.from('reports').insert({ reporter_id: reporterId, reported_user_id: reportedUserId, reason, details });
}
