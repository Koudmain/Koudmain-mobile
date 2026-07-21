import { useState, useCallback, useRef } from 'react';
import { SkillCategory, getSkillCategoryAsync } from '@koudmain/ui/api';

interface UseGetSkillCategoryReturn {
  mutateSkillCategory: () => Promise<SkillCategory[] | null>;
  skillsSkillCategory: SkillCategory[];
  isLoadingSkillCategory: boolean;
  errorSkillCategory: string | null;
}

export const useGetSkillCategory = (): UseGetSkillCategoryReturn => {
  const [isLoadingSkillCategory, setIsLoadingSkillCategory] = useState(false);
  const [errorSkillCategory, setErrorSkillCategory] = useState<string | null>(null);
  const [skillsSkillCategory, setSkillsSkillCategory] = useState<SkillCategory[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutateSkillCategory = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingSkillCategory(true);
    setErrorSkillCategory(null);

    try {
      const data = await getSkillCategoryAsync(controller.signal);
      setSkillsSkillCategory(data);
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
      setErrorSkillCategory(errorMessage);

      console.error('Erreur lors de la récupération des catégories de compétences:', err);
      return null;
    } finally {
      setIsLoadingSkillCategory(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return {
    mutateSkillCategory,
    skillsSkillCategory,
    isLoadingSkillCategory,
    errorSkillCategory,
  };
};
