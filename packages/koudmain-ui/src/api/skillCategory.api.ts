import { apiFetch } from '@koudmain/ui/utils/api';
import * as SecureStore from 'expo-secure-store';

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

export const getSkillCategoryAsync = async (signal?: AbortSignal): Promise<SkillCategory[]> => {
  try {
    let responseBody: SkillCategory[];
    const token = await SecureStore.getItemAsync('session');
    if (token) {
      responseBody = await apiFetch<SkillCategory[]>('/skill-category/get', {
        method: 'GET',
        signal,
        token: token,
      });

      if (Array.isArray(responseBody)) {
        return responseBody;
      }
      console.warn('Aucune catégorie de compétence trouvée ou réponse inattendue:', responseBody);
      return [];
    }
  } catch (error) {
    console.error('Echec de la récupération des categories de compétences:', error);
    throw error;
  }
  console.warn('Token de session manquant. Impossible de récupérer les catégories de compétences.');
  return [];
};
