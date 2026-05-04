export interface Message {
  id: string;
  conversation_id: number;
  sender_id: number;
  text: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
}
