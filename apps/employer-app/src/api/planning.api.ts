import { apiFetch } from '@koudmain/ui/utils/api';

export const planningService = {
  getPlanning: async (
    token: string,
    activeCompanyId: string | number,
    startDate?: Date,
    endDate?: Date,
  ) => {
    const params = new URLSearchParams({ activeCompanyId: String(activeCompanyId) });
    if (startDate && endDate) {
      params.set('startDate', startDate.toISOString());
      params.set('endDate', endDate.toISOString());
    }
    const url = `/planning?${params.toString()}`;
    return apiFetch<unknown>(url, {
      method: 'GET',
      token,
    });
  },
};
