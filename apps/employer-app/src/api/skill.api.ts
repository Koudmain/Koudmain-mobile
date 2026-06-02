import { apiFetch } from '@koudmain/ui';
import * as SecureStore from 'expo-secure-store';
import { Skill } from '@/types/skill';

export const getSkillByCategoryIdAsync = async (
  id: number,
  signal?: AbortSignal,
): Promise<Skill[]> => {
  try {
    let responseBody: Skill[];
    const token = await SecureStore.getItemAsync('session');
    if (token) {
      responseBody = await apiFetch<Skill[]>(`/skill/category/${id}`, {
        method: 'GET',
        signal,
        token: token,
      });

      if (Array.isArray(responseBody)) {
        return responseBody;
      }
      console.warn('Aucune compétence trouvée ou réponse inattendue:', responseBody);
      return [];
    }
  } catch (error) {
    console.error('Echec de la récupération des compétences de la catégorie:', id, error);
    throw error;
  }
  console.warn('Token de session manquant. Impossible de récupérer les compétences.');
  return [];
};
