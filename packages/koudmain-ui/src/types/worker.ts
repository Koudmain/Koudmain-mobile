import { IUser } from './user';

export interface IWorker {
  id: number;
  userId: number;
  workRadius: number;
  skillsDescription: string | null;
  user: IUser;
}
