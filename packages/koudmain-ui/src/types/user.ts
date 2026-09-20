export type UserRole = 'WORKER' | 'EMPLOYER';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string | null;
  role: UserRole;
}

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture_url?: string | null;
  email: string;
  is_worker_active: boolean;
  is_employer_active: boolean;
  createdAt: string;
}
