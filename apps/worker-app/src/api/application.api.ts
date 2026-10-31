import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '@koudmain/ui/utils/api';
import { CheckEligibilityResponseDto } from '@/types/application';

export const checkEligibilityAsync = async (
  publicationId: number,
  signal?: AbortSignal,
): Promise<CheckEligibilityResponseDto> => {
  const token = await SecureStore.getItemAsync('session');
  return apiFetch<CheckEligibilityResponseDto>(`/application/check/${publicationId}`, {
    method: 'GET',
    token,
    signal,
  });
};
