export interface PlanningEvent {
  id: number;
  name: string;
  image_profile: string | null;
  title: string;
  wage: number;
  time: string;
  end: string;
  rate: number;
  number_rate: number;
  starting_date: string;
}

export interface PlanningApiEvent {
  publication_id: number;
  starting_date: string;
  ending_date: string | null;
  title: string;
  salary: string;
  worker_name: string;
  worker_profile_picture: string | null;
  worker_rating: number;
  worker_rating_count: number;
}
