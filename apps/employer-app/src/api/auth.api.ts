import { apiFetch } from '@/utils/api';

export const authService = {
  login: async (email: string, password: string) => {
    return apiFetch<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password, targetApp: 'employer' },
    });
  },

  register: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_employer_active: boolean;
  }) => {
    return apiFetch<any>('/auth/register', {
      method: 'POST',
      body: data,
    });
  },
};
