import { IPublication, PublicationsDto } from '@/types/publication';
import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '@koudmain/ui/utils/api';

export interface PostResponse {
  message: string;
  id: string;
  createdAt: string;
}

export const createPostAsync = async (
  payload: PublicationsDto,
  signal?: AbortSignal,
): Promise<PostResponse> => {
  const token = await SecureStore.getItemAsync('session');
  return apiFetch<PostResponse>('/publication/create', {
    method: 'POST',
    token: token,
    body: JSON.stringify(payload),
    signal,
  });
};

export const getPublicationsAsync = async (signal?: AbortSignal): Promise<IPublication[]> => {
  const token = await SecureStore.getItemAsync('session');
  return apiFetch<IPublication[]>('/publication/get', {
    method: 'GET',
    token: token,
    signal,
  });
};
