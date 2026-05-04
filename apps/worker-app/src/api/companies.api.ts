import { Companies } from '@/types/companies';
import { apiFetch } from '@/utils/api';

export const companiesService = {
  getMyCompanies: async (token: string) => {
    return apiFetch<[Companies]>('/companies/my-companies', {
      method: 'GET',
      token: token,
    });
  },
};
