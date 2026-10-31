import { useState, useCallback, useRef } from 'react';
import { getPublicationByIdAsync } from '@/api/publications.api';
import { IPublication } from '@/types/publication';

interface UseGetPublicationByIdReturn {
  fetchPublication: (id: number) => Promise<IPublication | null>;
  publication: IPublication | null;
  isLoadingPublication: boolean;
  errorPublication: string | null;
}

export const useGetPublicationById = (): UseGetPublicationByIdReturn => {
  const [isLoadingPublication, setIsLoadingPublication] = useState(false);
  const [errorPublication, setErrorPublication] = useState<string | null>(null);
  const [publication, setPublication] = useState<IPublication | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPublication = useCallback(async (id: number) => {
    if (!Number.isFinite(id)) return null;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingPublication(true);
    setErrorPublication(null);

    try {
      const data = await getPublicationByIdAsync(id, controller.signal);
      setPublication(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return null;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération des détails de l'offre.";
      setErrorPublication(errorMessage);
      console.error("Erreur lors de la récupération de l'offre:", err);
      return null;
    } finally {
      setIsLoadingPublication(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { fetchPublication, publication, isLoadingPublication, errorPublication };
};
