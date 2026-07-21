export interface Message {
  id: string;
  conversationId: number;
  sender_id: number;
  text: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface IMessage {
  id: number;
  conversationId: number;
  content_text: string;
  sender_id: number;
  created_at: string;
  message_type?: string;
  type: string;
  isOptimistic?: boolean;
}
