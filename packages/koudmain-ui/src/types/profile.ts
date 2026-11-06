export interface IRatingSummary {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface IProfileReview {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: {
    name: string;
    pictureUrl: string | null;
    profileId?: number | null;
  };
}

export interface IProfileAddress {
  street_number?: string | null;
  street_name?: string | null;
  zip_code: string | null;
  city: string | null;
  full_address?: string | null;
}

export interface ICompanyProfilePublication {
  id: number;
  title: string;
  hourly_rate: string;
  starting_date: string;
  ending_date: string;
  status: string;
  skills: { id: number; name: string }[];
}

export interface ICompanyProfile {
  id: number;
  name: string;
  companyType: string | null;
  description: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  specialties: string | null;
  capacity: number | null;
  teamSize: string | null;
  mealProvided: boolean;
  dressCode: string | null;
  siretVerified: boolean;
  koudmainValidated: boolean;
  address: IProfileAddress | null;
  reliability: {
    missionsPublished: number;
    paidOnTimeRate: number | null;
    avgResponseTimeMin: number | null;
  };
  rating: IRatingSummary;
  openPublications: ICompanyProfilePublication[];
  reviews: IProfileReview[];
}

export type WorkerVerificationType = 'IDENTITY' | 'SOCIAL_SECURITY' | 'ADDRESS_PROOF';

export type WorkerVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type WorkerFormationType = 'FORMATION' | 'DIPLOMA' | 'PERMIT';

export interface IWorkerProfileDocument {
  url: string;
  name: string;
  sizeBytes: number | null;
}

export interface IWorkerProfile {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
    createdAt: string;
  };
  bio: string | null;
  address: Pick<IProfileAddress, 'city' | 'zip_code'> | null;
  skills: { id: number; name: string }[];
  reliability: {
    missionsCompleted: number;
    responseRate: number | null;
    avgResponseTimeMin: number | null;
  };
  verifications: { type: WorkerVerificationType; status: WorkerVerificationStatus }[];
  experiences: { id: number; title: string; durationMonths: number | null }[];
  formations: {
    id: number;
    title: string;
    institution: string | null;
    type: WorkerFormationType | null;
    obtainedDate: string | null;
  }[];
  hasApplied: boolean;
  documents: {
    cv: IWorkerProfileDocument | null;
    coverLetter: IWorkerProfileDocument | null;
  };
  rating: IRatingSummary;
  reviews: IProfileReview[];
  workRadius?: number;
}
