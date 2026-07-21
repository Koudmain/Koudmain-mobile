import { useState, useCallback, useRef } from 'react';
import { createPostAsync, PostResponse } from '@/api/publications.api';
import { PublicationsDto } from '@/types/publication';

interface UseCreatePostReturn {
  mutate: (payload: PublicationsDto) => Promise<PostResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export const useCreatePost = (): UseCreatePostReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutate = useCallback(async (payload: PublicationsDto) => {
    if (abortControllerRef.current) {
      console.log('Aborting previous create post request.');
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const data = await createPostAsync(payload, controller.signal);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('La requête de création de post a été annulée.');
        return null;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la création de la publication.';
      setError(errorMessage);

      console.error('Erreur lors de la création de la publication:', err);
      return null;
    } finally {
      setIsLoading(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { mutate, isLoading, error };
};
