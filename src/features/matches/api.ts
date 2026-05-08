import { getMatchesForCurrentUser, getMessagesRepository, sendMessageRepository } from '@/shared/data/repository';
import type { Match, Message } from '@/shared/types/domain';

export async function getMatches(): Promise<Match[]> {
  return getMatchesForCurrentUser();
}

export async function getMessages(matchId: string): Promise<Message[]> {
  return getMessagesRepository(matchId);
}

export async function sendMessage(matchId: string, senderId: string, body: string, wasAiAssisted: boolean) {
  return sendMessageRepository(matchId, senderId, body, wasAiAssisted);
}
