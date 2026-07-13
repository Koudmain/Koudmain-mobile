export interface Message {
  id: string;
  conversationId: number;
  sender_id: number;
  text: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
}
