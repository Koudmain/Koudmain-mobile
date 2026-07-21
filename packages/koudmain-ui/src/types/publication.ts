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
