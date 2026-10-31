import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '@koudmain/ui/utils/api';
import { IPublication } from '@/types/publication';

export const getPublicationsAsync = async (signal?: AbortSignal): Promise<IPublication[]> => {
  const token = await SecureStore.getItemAsync('session');
  return apiFetch<IPublication[]>('/publication/get', {
    method: 'GET',
    token,
    signal,
  });
};

export const getPublicationByIdAsync = async (
  id: number,
  signal?: AbortSignal,
): Promise<IPublication> => {
  const token = await SecureStore.getItemAsync('session');
  return apiFetch<IPublication>(`/publication/${id}`, {
    method: 'GET',
    token,
    signal,
  });
};
