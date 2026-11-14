export type ApplicationStatus = 'accepted' | 'pending';

export interface PlanningEvent {
  id: number;
  companyId: number | null;
  name: string;
  image_profile: string | null;
  title: string;
  wage: number;
  time: string;
  end: string;
  rate: number;
  number_rate: number;
  status: ApplicationStatus;
  city: string;
  zip: string;
  starting_date: string;
}

export interface PlanningApiEvent {
  publicationId: number;
  starting_date: string;
  ending_date: string | null;
  title: string;
  salary: string;
  companyId: number | null;
  company_name: string | null;
  company_logo: string | null;
  companyRating: number;
  companyRatingCount: number;
  application_status: 'Accepted' | 'Pending';
  city: string;
  zip: string;
}
