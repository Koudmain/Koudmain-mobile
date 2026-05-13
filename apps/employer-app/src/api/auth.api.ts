import { apiFetch } from '@/utils/api';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export const authService = {
  login: async (email: string, password: string) => {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password, targetApp: 'employer' },
    });
  },

  refresh: async (refreshToken: string) => {
    return apiFetch<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken },
    });
  },

  logout: async (token: string) => {
    return apiFetch<{ message: string }>('/auth/logout', {
      method: 'POST',
      token,
    });
  },

  register: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_employer_active: boolean;
  }) => {
    return apiFetch<LoginResponse>('/auth/register', {
      method: 'POST',
      body: data,
    });
  },
};
