import { blockUserRepository, reportUserRepository } from '@/shared/data/repository';

export async function blockUser(blockedId: string) {
  return blockUserRepository(blockedId);
}

export async function reportUser(reportedUserId: string, reason: string, details?: string) {
  return reportUserRepository(reportedUserId, reason, details);
}
