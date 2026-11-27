export interface Message {
  id: string;
  conversationId: number;
  sender_id: number;
  text: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}
