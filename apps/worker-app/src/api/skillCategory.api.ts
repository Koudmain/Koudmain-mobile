import { apiFetch } from '@koudmain/ui/utils/api';

export interface SkillCategory {
  id: number;
  name: string;
}

export const skillCategoryService = {
  getAll: async () => {
    return apiFetch<SkillCategory[]>('/skill-category/get', {
      method: 'GET',
      skipAuthRefresh: true,
    });
  },
};
