import { apiFetch } from '@koudmain/ui/utils/api';
import { CreateConversationDto, IConversation } from '../types/conversation';
import { IMessage, SendMessageDto } from '../types/message';

export type CreateConversationPayload = CreateConversationDto;

export const chatService = {
  createConversation: async (token: string, payload: CreateConversationDto) => {
    return apiFetch<IConversation>('/chat/conversations', {
      method: 'POST',
      token,
      body: payload,
    });
  },

  getMessages: async (token: string, conversationId: number, signal?: AbortSignal) => {
    return apiFetch<IMessage[]>(`/chat/conversations/${conversationId}/messages`, {
      method: 'GET',
      token,
      signal,
    });
  },

  sendMessage: async (token: string, conversationId: number, content: string) => {
    const body: SendMessageDto = {
      conversationId,
      content,
    };
    return apiFetch<IMessage>('/chat/messages', {
      method: 'POST',
      token,
      body,
    });
  },
};
