import { apiFetch } from '@koudmain/ui/utils/api';
import { chatService as sharedChatService } from '@koudmain/ui/api/chat.api';
import { IConversation } from '@koudmain/ui/types/conversation';

export const chatService = {
  ...sharedChatService,

  getWorkerConversations: async (token: string, signal?: AbortSignal) => {
    return apiFetch<IConversation[]>('/chat/worker/conversations', {
      method: 'GET',
      token,
      signal,
    });
  },
};
