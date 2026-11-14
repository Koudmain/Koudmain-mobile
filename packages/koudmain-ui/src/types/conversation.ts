import { IMessage } from './message';
import { IPublication } from './publication';
import { IWorker } from './worker';

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

export interface IConversationCompany {
  id?: number;
  name?: string;
  logoUrl?: string | null;
  logo_url?: string | null;
}

export interface IConversation {
  id: number;
  publicationId: number;
  publication_id?: number;
  workerId: number;
  worker_id?: number;
  companyId: number;
  company_id?: number;
  updated_at: string;
  worker?: IWorker;
  settings?: IConversationSettings;
  publication?: IPublication & {
    company?: IConversationCompany;
  };
  company?: IConversationCompany;
  last_message: IMessage[];
  other_user_name?: string;
  other_user_avatar?: string;
  last_message_content?: string;
  last_message_time?: string;
  is_pinned?: boolean;
  publication_title?: string;
}

export interface IConversationSettings {
  id: number;
  userId: number;
  conversationId: number;
  is_pinned: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
