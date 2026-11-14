import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '@koudmain/ui/utils/api';
import { ApplyDto, CheckEligibilityResponseDto, IApplication } from '@/types/application';

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

export const applyToPublicationAsync = async (
  payload: ApplyDto,
  signal?: AbortSignal,
): Promise<IApplication> => {
  const token = await SecureStore.getItemAsync('session');
  return apiFetch<IApplication>('/application/apply', {
    method: 'POST',
    token,
    body: payload,
    signal,
  });
};

export const getMyApplicationsAsync = async (signal?: AbortSignal): Promise<IApplication[]> => {
  const token = await SecureStore.getItemAsync('session');
  return apiFetch<IApplication[]>('/application/me', {
    method: 'GET',
    token,
    signal,
  });
};

export const cancelApplicationAsync = async (
  id: number,
  signal?: AbortSignal,
): Promise<IApplication> => {
  const token = await SecureStore.getItemAsync('session');
  return apiFetch<IApplication>(`/application/${id}`, {
    method: 'DELETE',
    token,
    signal,
  });
};
