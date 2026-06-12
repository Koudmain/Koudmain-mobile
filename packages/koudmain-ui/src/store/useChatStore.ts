import { create } from 'zustand';
import { IMessage } from '../types/message';

interface ChatState {
  messages: IMessage[];
  addMessage: (msg: IMessage) => void;
  setMessages: (msgs: IMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => {
      const optimisticIndex = state.messages.findIndex(
        (m) =>
          m.isOptimistic &&
          m.content_text === msg.content_text &&
          m.sender_id === msg.sender_id &&
          m.conversationId === msg.conversationId,
      );

      let newMessages = [...state.messages];
      if (optimisticIndex !== -1) {
        newMessages[optimisticIndex] = { ...msg, isOptimistic: false };
      } else if (!state.messages.some((m) => m.id === msg.id)) {
        newMessages = [msg, ...newMessages];
      }

      return { messages: newMessages };
    }),
  setMessages: (msgs) => set({ messages: msgs }),
}));
