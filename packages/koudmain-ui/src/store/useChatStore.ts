import { create } from 'zustand';
import { IMessage } from '../types/message';

interface ChatState {
  messages: IMessage[];
  addMessage: (msg: IMessage) => void;
  setMessages: (msgs: IMessage[]) => void;
}

const getConversationId = (msg: IMessage): number => {
  return Number(msg.conversationId);
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => {
      // Normaliser conversationId pour supporter le camelCase et le snake_case (WebSocket / API)
      const convId = getConversationId(msg);
      const normalizedMsg: IMessage = {
        ...msg,
        conversationId: convId || msg.conversationId,
      };

      // Réconciliation optimiste : trouve le message temporaire de même contenu dans la conversation
      const optimisticIndex = state.messages.findIndex((m) => {
        if (!m.isOptimistic) return false;
        const sameConv = getConversationId(m) === convId;
        const sameContent = m.content_text === normalizedMsg.content_text;
        return sameConv && sameContent;
      });

      let newMessages = [...state.messages];
      if (optimisticIndex !== -1) {
        newMessages[optimisticIndex] = { ...normalizedMsg, isOptimistic: false };
      } else if (!state.messages.some((m) => m.id === normalizedMsg.id)) {
        newMessages = [normalizedMsg, ...newMessages];
      }

      return { messages: newMessages };
    }),
  setMessages: (msgs) =>
    set({
      messages: msgs.map((m) => ({
        ...m,
        conversationId: getConversationId(m) || m.conversationId,
      })),
    }),
}));
