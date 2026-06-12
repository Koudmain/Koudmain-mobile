import { IUser } from '@koudmain/ui/types';

export interface IWorker {
  id: number;
  userId: number;
  workRadius: number;
  skillsDescription: string | null;
  user: IUser;
}
