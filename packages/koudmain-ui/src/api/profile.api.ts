import { apiFetch } from '@koudmain/ui/utils/api';
import { appendImage } from '../utils/formData';
import { AddressData } from '../components/form/AddressAutocomplete';
import { ICompanyProfile, IWorkerProfile, WorkerFormationType } from '../types/profile';

export interface UpdateCompanyProfilePayload {
  name: string;
  companyType: string | null;
  description: string;
  specialties: string;
  capacity: string;
  teamSize: string;
  mealProvided: boolean;
  dressCode: string;
  logoUri?: string | null;
  coverUri?: string | null;
}

export interface UpdateWorkerProfilePayload {
  bio?: string;
  workRadius?: number;
  skillCategoryIds?: number[];
  experiences?: { title: string; durationMonths?: number }[];
  formations?: {
    title: string;
    institution?: string;
    type?: WorkerFormationType;
    obtainedDate?: string;
  }[];
  address?: AddressData;
}

const toAddressDto = ({ streetNumber, streetName, zipCode, city, country }: AddressData) => ({
  streetNumber,
  streetName,
  zipCode,
  city,
  country,
});

export const profileService = {
  getCompanyProfile: async (token: string, companyId: number, signal?: AbortSignal) => {
    return apiFetch<ICompanyProfile>(`/companies/${companyId}/profile`, {
      method: 'GET',
      token,
      signal,
    });
  },

  updateCompanyProfile: async (
    token: string,
    companyId: number,
    { logoUri, coverUri, ...fields }: UpdateCompanyProfilePayload,
  ) => {
    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null) formData.append(key, String(value));
    });
    if (logoUri) appendImage(formData, 'logo', logoUri);
    if (coverUri) appendImage(formData, 'cover', coverUri);

    return apiFetch<ICompanyProfile>(`/companies/${companyId}`, {
      method: 'PATCH',
      token,
      body: formData,
    });
  },

  updateCompanyAddress: async (token: string, companyId: number, address: AddressData) => {
    return apiFetch(`/companies/${companyId}/address`, {
      method: 'PUT',
      token,
      body: toAddressDto(address),
    });
  },

  getWorkerProfile: async (token: string, workerId: number | 'me', signal?: AbortSignal) => {
    return apiFetch<IWorkerProfile>(`/workers/${workerId}/profile`, {
      method: 'GET',
      token,
      signal,
    });
  },

  updateMyWorkerProfile: async (
    token: string,
    { address, ...payload }: UpdateWorkerProfilePayload,
  ) => {
    return apiFetch<IWorkerProfile>('/workers/me', {
      method: 'PATCH',
      token,
      body: { ...payload, address: address && toAddressDto(address) },
    });
  },
};
