import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { IWorkerProfile } from '../types/profile';
import { profileService } from '../api/profile.api';

interface UseGetWorkerProfileReturn {
  workerProfile: IWorkerProfile | null;
  isLoadingWorkerProfile: boolean;
  errorWorkerProfile: string | null;
  refetchWorkerProfile: () => void;
}

export const useGetWorkerProfile = (
  session: string | null,
  workerId: number | 'me',
): UseGetWorkerProfileReturn => {
  const [workerProfile, setWorkerProfile] = useState<IWorkerProfile | null>(null);
  const [isLoadingWorkerProfile, setIsLoadingWorkerProfile] = useState(true);
  const [errorWorkerProfile, setErrorWorkerProfile] = useState<string | null>(null);

  const loadProfile = useCallback(() => {
    if (!session) return;
    if (!workerId) {
      setIsLoadingWorkerProfile(false);
      setErrorWorkerProfile("Le profil de ce travailleur n'est pas disponible.");
      return;
    }

    const controller = new AbortController();

    const fetchWorkerProfile = async () => {
      setIsLoadingWorkerProfile(true);
      setErrorWorkerProfile(null);

      try {
        const data = await profileService.getWorkerProfile(session, workerId, controller.signal);
        setWorkerProfile(data);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;

        console.error('Erreur lors de la récupération du profil du travailleur:', err);
        setErrorWorkerProfile("Le profil de ce travailleur n'est pas disponible.");
      } finally {
        if (!controller.signal.aborted) setIsLoadingWorkerProfile(false);
      }
    };

    fetchWorkerProfile();

    return () => controller.abort();
  }, [session, workerId]);

  useFocusEffect(loadProfile);

  return {
    workerProfile,
    isLoadingWorkerProfile,
    errorWorkerProfile,
    refetchWorkerProfile: loadProfile,
  };
};
