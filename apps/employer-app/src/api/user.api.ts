import { User } from '@/types/user';
import { apiFetch } from '@koudmain/ui';

export const userService = {
  getMe: async (token: string) => {
    return apiFetch<User>('/users/me', {
      method: 'GET',
      token: token,
    });
  },

  uploadAvatar: async (token: string, fileUri: string) => {
    const formData = new FormData();
    // @ts-ignore React Native's FormData doesn't support the standard File API, so we need to provide the file info manually
    formData.append('image', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    });

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

    if (data.imageUri) {
      const filename = data.imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      // @ts-ignore React Native's FormData doesn't support the standard File API, so we need to provide the file info manually
      formData.append('image', {
        uri: data.imageUri,
        name: filename,
        type,
      });
    }

    return apiFetch<any>('/users/me', {
      method: 'PATCH',
      token,
      body: formData,
    });
  },
};
