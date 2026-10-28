import { User } from '../types/user';
import { apiFetch } from '@koudmain/ui/utils/api';
import { appendImage } from '../utils/formData';

export const userService = {
  getMe: async (token: string) => {
    return apiFetch<User>('/users/me', {
      method: 'GET',
      token: token,
    });
  },

  uploadAvatar: async (token: string, fileUri: string) => {
    const formData = new FormData();
    appendImage(formData, 'image', fileUri);

    return apiFetch<User>('/users/me/avatar', {
      method: 'PATCH',
      token: token,
      body: formData,
    });
  },

  updateProfile: async (
    token: string,
    data: { first_name?: string; last_name?: string; imageUri?: string | null },
  ) => {
    const formData = new FormData();

    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);

    if (data.imageUri) appendImage(formData, 'image', data.imageUri);

    return apiFetch<User>('/users/me', {
      method: 'PATCH',
      token,
      body: formData,
    });
  },
};
