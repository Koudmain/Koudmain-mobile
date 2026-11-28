import { useState, useCallback, useRef } from 'react';
import { checkEligibilityAsync } from '@/api/application.api';
import { CheckEligibilityResponseDto } from '@/types/application';

interface UseCheckEligibilityReturn {
  checkEligibility: (publicationId: number) => Promise<CheckEligibilityResponseDto | null>;
  eligibility: CheckEligibilityResponseDto | null;
  isCheckingEligibility: boolean;
  errorEligibility: string | null;
}

export const useCheckEligibility = (): UseCheckEligibilityReturn => {
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [errorEligibility, setErrorEligibility] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<CheckEligibilityResponseDto | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkEligibility = useCallback(async (publicationId: number) => {
    if (!Number.isFinite(publicationId)) return null;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsCheckingEligibility(true);
    setErrorEligibility(null);

    try {
      const data = await checkEligibilityAsync(publicationId, controller.signal);
      setEligibility(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return null;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la vérification d'éligibilité.";
      setErrorEligibility(errorMessage);
      return null;
    } finally {
      setIsCheckingEligibility(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return {
    checkEligibility,
    eligibility,
    isCheckingEligibility,
    errorEligibility,
  };
};
