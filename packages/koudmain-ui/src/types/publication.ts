export enum PublicationStatus {
  OPEN = 'Ouverte',
  CLOSE = 'Fermée',
  URGENT = 'Urgente',
}

export interface PublicationSkillCategory {
  id: number;
  name: string;
}

export interface PublicationSkill {
  id: number;
  name: string;
  category?: PublicationSkillCategory;
}

export interface PublicationAddress {
  id?: number;
  streetNumber?: string | null;
  streetName?: string | null;
  zipCode?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface PublicationCompany {
  id: number;
  name?: string | null;
  companyType?: string | null;
  description?: string | null;
  logo?: string | null;
  cover?: string | null;
  gallery?: string[] | null;
  dressCode?: string | null;
  mealProvided?: boolean | null;
  rating?: number | null;
  reviewCount?: number | null;
  address?: PublicationAddress | null;
}

export interface IPublication {
  id: number;
  companyId: number | null;
  createdByUserId: number | null;
  address_id: number | null;
  title: string;
  description: string;
  hourly_rate: string | number;
  starting_date: string;
  ending_date: string;
  status: string | null;
  views: string | number;
  clicks: string | number;
  createdAt: string;
  updatedAt: string;
  autoAccept?: boolean;
  highlight?: boolean;
  skills?: PublicationSkill[];
  company?: PublicationCompany | null;
  address?: PublicationAddress | null;
}

export interface PublicationsDto {
  companyId?: number;
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
