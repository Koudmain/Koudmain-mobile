import { useState, useCallback, useRef } from 'react';
import { getSkillByCategoryIdAsync } from '@/api/skill.api';
import { Skill } from '@/types/skill';

interface UseGetSkillReturn {
  mutateSkill: (categoryId: number) => Promise<Skill[] | null>;
  skillsSkill: Skill[];
  isLoadingSkill: boolean;
  errorSkill: string | null;
}

export const useGetSkillByCategoryId = (): UseGetSkillReturn => {
  const [isLoadingSkill, setIsLoadingSkill] = useState(false);
  const [errorSkill, setErrorSkill] = useState<string | null>(null);
  const [skillsSkill, setSkillsSkill] = useState<Skill[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutateSkill = useCallback(async (categoryId: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingSkill(true);
    setErrorSkill(null);

    try {
      const data = await getSkillByCategoryIdAsync(categoryId, controller.signal);
      setSkillsSkill(data);
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
      setErrorSkill(errorMessage);

      console.error('Erreur lors de la récupération des compétences:', err);
      return null;
    } finally {
      setIsLoadingSkill(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { mutateSkill, skillsSkill, isLoadingSkill, errorSkill };
};
