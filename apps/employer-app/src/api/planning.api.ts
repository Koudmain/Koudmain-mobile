import { apiFetch } from '@koudmain/ui/utils/api';
import { PlanningApiEvent } from '@/types/planning';

export const planningService = {
  getPlanning: async (
    token: string,
    activeCompanyId: string | number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PlanningApiEvent[]> => {
    const params = new URLSearchParams({ activeCompanyId: String(activeCompanyId) });
    if (startDate && endDate) {
      params.set('startDate', startDate.toISOString());
      params.set('endDate', endDate.toISOString());
    }
    const url = `/planning?${params.toString()}`;
    return apiFetch<PlanningApiEvent[]>(url, {
      method: 'GET',
      token,
    });
  },
};
