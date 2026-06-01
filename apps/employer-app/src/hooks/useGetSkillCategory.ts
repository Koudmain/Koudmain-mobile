import { useState, useCallback, useRef } from 'react';
import { SkillCategory } from '@/types/skill-category';
import { getSkillCategoryAsync } from '@/api/skillCategory.api';

interface UseGetSkillCategoryReturn {
  mutate_skill_category: () => Promise<SkillCategory[] | null>;
  skills_skill_category: SkillCategory[];
  isLoading_skill_category: boolean;
  error_skill_category: string | null;
}

export const useGetSkillCategory = (): UseGetSkillCategoryReturn => {
  const [isLoading_skill_category, setIsLoading_skill_category] = useState(false);
  const [error_skill_category, setError_skill_category] = useState<string | null>(null);
  const [skills_skill_category, setSkills_skill_category] = useState<SkillCategory[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutate_skill_category = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading_skill_category(true);
    setError_skill_category(null);

    try {
      const data = await getSkillCategoryAsync(controller.signal);
      setSkills_skill_category(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('La requête pour obtenir les catégories de compétences a été annulée.');
        return null;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la récupération des catégories de compétences.';
      setError_skill_category(errorMessage);

      console.error('Erreur lors de la récupération des catégories de compétences:', err);
      return null;
    } finally {
      setIsLoading_skill_category(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return {
    mutate_skill_category,
    skills_skill_category,
    isLoading_skill_category,
    error_skill_category,
  };
};
