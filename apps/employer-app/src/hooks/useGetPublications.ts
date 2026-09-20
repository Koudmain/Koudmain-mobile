import { useState, useCallback, useRef } from 'react';
import { getPublicationsAsync } from '@/api/publications.api';
import { IPublication } from '@/types/publication';

interface UseGetPublicationsReturn {
  mutatePublications: () => Promise<IPublication[] | null>;
  publications: IPublication[];
  isLoadingPublications: boolean;
  errorPublications: string | null;
}

export const useGetPublications = (): UseGetPublicationsReturn => {
  const [isLoadingPublications, setIsLoadingPublications] = useState(false);
  const [errorPublications, setErrorPublications] = useState<string | null>(null);
  const [publications, setPublications] = useState<IPublication[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutatePublications = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingPublications(true);
    setErrorPublications(null);

    try {
      const data = await getPublicationsAsync(controller.signal);
      setPublications(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('La requête de récupération des publications a été annulée.');
        return null;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la récupération des publications.';
      setErrorPublications(errorMessage);

      console.error('Erreur lors de la récupération des publications:', err);
      return null;
    } finally {
      setIsLoadingPublications(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { mutatePublications, publications, isLoadingPublications, errorPublications };
};
