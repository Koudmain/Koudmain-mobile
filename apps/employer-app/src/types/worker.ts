import { IUser } from '@koudmain/ui/types';

export interface IWorker {
  id: number;
  user_id: number;
  max_distance_km: number;
  skills_description: string | null;
  user: IUser;
}
