import { apiFetch } from '@koudmain/ui/utils/api';

export type PlanningQuery = {
  // Required by the API for an employer, ignored for a worker.
  activeCompanyId?: string | number;
  startDate?: Date;
  endDate?: Date;
};

export const planningService = {
  getPlanning: async <T>(token: string, query: PlanningQuery = {}): Promise<T[]> => {
    const params = new URLSearchParams();
    if (query.activeCompanyId !== undefined) {
      params.set('activeCompanyId', String(query.activeCompanyId));
    }
    if (query.startDate && query.endDate) {
      params.set('startDate', query.startDate.toISOString());
      params.set('endDate', query.endDate.toISOString());
    }
    const search = params.toString();
    return apiFetch<T[]>(search ? `/planning?${search}` : '/planning', {
      method: 'GET',
      token,
    });
  },
};
