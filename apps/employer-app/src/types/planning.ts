export type PlanningStatus = 'filled' | 'open' | 'no_candidate';

export interface PlanningEvent {
  id: number;
  name: string | null;
  image_profile: string | null;
  title: string;
  wage: number;
  time: string;
  end: string;
  rate: number;
  number_rate: number;
  status: PlanningStatus;
  pending_applications: number;
  starting_date: string;
  workerId: number | null;
}

export interface PlanningApiEvent {
  publicationId: number;
  starting_date: string;
  ending_date: string | null;
  title: string;
  salary: string;
  worker_name: string | null;
  worker_profile_picture: string | null;
  workerId: number | null;
  workerRating: number;
  workerRatingCount: number;
  status: PlanningStatus;
  pendingApplicationsCount: number;
}
