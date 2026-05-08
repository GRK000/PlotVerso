import { getDiscoverCandidatesForCurrentUser, recordLikeRepository } from '@/shared/data/repository';

export async function getDiscoverCandidates() {
  return getDiscoverCandidatesForCurrentUser();
}

export async function recordLike(toUserId: string, value: 'like' | 'pass', score: number) {
  return recordLikeRepository(toUserId, value, score);
}
