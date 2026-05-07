import { apiFetch } from '@/utils/api';

export const planningService = {
  getPlanning: async (token: string, startDate?: Date, endDate?: Date) => {
    let url = '/planning';
    if (startDate && endDate) {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      url += `?${params.toString()}`;
    }
    return apiFetch<any>(url, {
      method: 'GET',
      token,
    });
  },
};
