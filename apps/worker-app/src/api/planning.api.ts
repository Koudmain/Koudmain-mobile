import { apiFetch } from '@koudmain/ui/utils/api';
import { PlanningApiEvent } from '@/types/planning';

export const planningService = {
  getPlanning: async (
    token: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PlanningApiEvent[]> => {
    let url = '/planning';
    if (startDate && endDate) {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      url += `?${params.toString()}`;
    }
    return apiFetch<PlanningApiEvent[]>(url, {
      method: 'GET',
      token,
    });
  },
};
