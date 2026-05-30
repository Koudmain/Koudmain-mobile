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
  status: 'accepted' | 'pending';
  city: string;
  zip: string;
  starting_date: string;
}

export interface PlanningApiEvent {
  publication_id: number;
  starting_date: string;
  ending_date: string | null;
  title: string;
  salary: string;
  company_name: string;
  company_logo: string | null;
  company_rating: number;
  company_rating_count: number;
  application_status: string;
  city: string;
  zip: string;
}
