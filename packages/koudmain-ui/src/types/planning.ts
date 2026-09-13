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
  status?: 'accepted' | 'pending';
  city?: string;
  zip?: string;
  starting_date: string;
}

export interface PlanningApiEvent {
  publicationId: number;
  starting_date: string;
  ending_date: string | null;
  title: string;
  salary: string;
  company_name: string;
  company_logo: string | null;
  companyRating: number;
  companyRatingCount: number;
  application_status: string;
  city: string;
  zip: string;
}
