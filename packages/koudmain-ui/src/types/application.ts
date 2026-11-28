import { IPublication } from './publication';

export type ApplicationStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface IApplication {
  id: number;
  publicationId: number;
  workerId: number;
  status: ApplicationStatus;
  message?: string | null;
  createdAt: string;
  updatedAt?: string;
  publication?: IPublication;
}
