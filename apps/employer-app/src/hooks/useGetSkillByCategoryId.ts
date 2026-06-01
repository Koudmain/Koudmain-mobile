import { useState, useCallback, useRef } from 'react';
import { getSkillByCategoryIdAsync } from '@/api/skill.api';
import { Skill } from '@/types/skill';

interface UseGetSkillReturn {
  mutate_skill: (categoryId: number) => Promise<Skill[] | null>;
  skills_skill: Skill[];
  isLoading_skill: boolean;
  error_skill: string | null;
}

export const useGetSkillByCategoryId = (): UseGetSkillReturn => {
  const [isLoading_skill, setIsLoading_skill] = useState(false);
  const [error_skill, setError_skill] = useState<string | null>(null);
  const [skills_skill, setSkills_skill] = useState<Skill[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutate_skill = useCallback(async (categoryId: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading_skill(true);
    setError_skill(null);

    try {
      const data = await getSkillByCategoryIdAsync(categoryId, controller.signal);
      setSkills_skill(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('La requête pour obtenir les compétences a été annulée.');
        return null;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la récupération des compétences.';
      setError_skill(errorMessage);

      console.error('Erreur lors de la récupération des compétences:', err);
      return null;
    } finally {
      setIsLoading_skill(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { mutate_skill, skills_skill, isLoading_skill, error_skill };
};
