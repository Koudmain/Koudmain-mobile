import { IConversation } from '@koudmain/ui';
import { IMessage } from '@/types/message';
import { apiFetch } from '@koudmain/ui/utils/api';

export const chatService = {
  getMessages: async (token: string, conversationId: number) => {
    return apiFetch<IMessage[]>(`/chat/conversations/${conversationId}/messages`, {
      method: 'GET',
      token,
    });
  },

  getWorkerConversations: async (token: string) => {
    return apiFetch<IConversation[]>('/chat/worker/conversations', {
      method: 'GET',
      token,
    });
  },

  getOneConversation: async (token: string, conversationId: number) => {
    try {
      return await apiFetch<IConversation>(`/chat/conversations/${conversationId}`, {
        method: 'GET',
        token,
      });
    } catch {
      try {
        return await apiFetch<IConversation>(`/chat/worker/conversations/${conversationId}`, {
          method: 'GET',
          token,
        });
      } catch {
        const all = await apiFetch<IConversation[]>('/chat/worker/conversations', {
          method: 'GET',
          token,
        });
        const found = all?.find((c) => c.id === conversationId);
        if (found) return found;
        throw new Error(`Conversation #${conversationId} introuvable`);
      }
    }
  },

  sendMessage: async (token: string, conversationId: number, content: string) => {
    return apiFetch<IMessage>('/chat/messages', {
      method: 'POST',
      token,
      body: {
        conversationId,
        content,
      },
    });
  },
};
