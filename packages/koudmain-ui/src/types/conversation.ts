import { IMessage } from './message';
import { IPublication } from './publication';
import { IWorker } from './worker';

export type Conversation = {
  id: number;
  publication_id: number;
  other_user_name: string;
  other_user_avatar: string;
  last_message_content: string;
  last_message_time: string;
  unread_count: number;
  status: 'active' | 'archived';
  is_pinned: boolean;
  publication_title: string;
};

export interface IConversation {
  id: number;
  publication_id: number;
  worker_id: number;
  company_id: number;
  updated_at: string;
  worker: IWorker;
  settings: IConversationSettings;
  publication: IPublication;
  last_message: IMessage[];
}

export interface IConversationSettings {
  id: number;
  user_id: number;
  conversation_id: number;
  is_pinned: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
