import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ICompanyProfile } from '../types/profile';
import { profileService } from '../api/profile.api';

interface UseGetCompanyProfileReturn {
  companyProfile: ICompanyProfile | null;
  isLoadingCompanyProfile: boolean;
  errorCompanyProfile: string | null;
  refetchCompanyProfile: () => void;
}

export const useGetCompanyProfile = (
  session: string | null,
  companyId: number,
): UseGetCompanyProfileReturn => {
  const [companyProfile, setCompanyProfile] = useState<ICompanyProfile | null>(null);
  const [isLoadingCompanyProfile, setIsLoadingCompanyProfile] = useState(true);
  const [errorCompanyProfile, setErrorCompanyProfile] = useState<string | null>(null);

  const loadProfile = useCallback(() => {
    if (!session) return;
    if (!companyId) {
      setIsLoadingCompanyProfile(false);
      setErrorCompanyProfile("Le profil de cet établissement n'est pas disponible.");
      return;
    }

    const controller = new AbortController();

    const fetchCompanyProfile = async () => {
      setIsLoadingCompanyProfile(true);
      setErrorCompanyProfile(null);

      try {
        const data = await profileService.getCompanyProfile(session, companyId, controller.signal);
        setCompanyProfile(data);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;

        console.error("Erreur lors de la récupération du profil de l'établissement:", err);
        setErrorCompanyProfile("Le profil de cet établissement n'est pas disponible.");
      } finally {
        if (!controller.signal.aborted) setIsLoadingCompanyProfile(false);
      }
    };

    fetchCompanyProfile();

    return () => controller.abort();
  }, [session, companyId]);

  useFocusEffect(loadProfile);

  return {
    companyProfile,
    isLoadingCompanyProfile,
    errorCompanyProfile,
    refetchCompanyProfile: loadProfile,
  };
};
