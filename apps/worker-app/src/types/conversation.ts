export type Conversation = {
  id: number;
  publicationId: number;
  other_user_name: string;
  other_user_avatar: string;
  last_message_content: string;
  last_message_time: string;
  unread_count: number;
  status: 'active' | 'archived';
  is_pinned: boolean;
  publication_title: string;
};
