import { apiFetch } from '@koudmain/ui';
import * as SecureStore from 'expo-secure-store';
import { SkillCategory } from '@/types/skill-category';

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
