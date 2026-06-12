export enum PublicationStatus {
  OPEN = 'Ouverte',
  CLOSE = 'Fermée',
  URGENT = 'Urgente',
}

export interface IPublication {
  id: number;
  companyId: number | null;
  createdByUserId: number | null;
  address_id: number | null;
  title: string;
  description: string;
  hourly_rate: string;
  starting_date: string;
  ending_date: string;
  status: string | null;
  views: string;
  clicks: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationsDto {
  createdByUserId?: number;
  address_id?: number;
  title: string;
  description: string;
  hourly_rate: number;
  starting_date: string;
  ending_date: string;
  status?: PublicationStatus;
  skills: number[];
  autoAccept: boolean;
  highlight: boolean;
}
