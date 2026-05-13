import { IConversation } from '@/types/conversation';
import { IMessage } from '@/types/message';
import { apiFetch } from '@/utils/api';

export const chatService = {
  getMessages: async (token: string, conversationId: number) => {
    return apiFetch<IMessage[]>(`/chat/conversations/${conversationId}/messages`, {
      method: 'GET',
      token: token,
    });
  },

  getCompanyConversation: async (token: string, companyId: number) => {
    console.log("Fetching conversations for company ID:", companyId);
    return apiFetch<IConversation[]>(`/chat/company/${companyId}/conversations`, {
      method: 'GET',
      token: token,
    });
  },

  getOneCompanyConversation: async (token: string, conversationId: number) => {
    return apiFetch<IConversation>(`/chat/company/conversations/${conversationId}`, {
      method: 'GET',
      token: token,
    });
  },

  sendMessage: async (token: string, conversationId: number, content: string) => {
    return apiFetch<IMessage>('/chat/messages', {
      method: 'POST',
      token: token,
      body: {
        conversationId,
        content,
      },
    });
  },
};
