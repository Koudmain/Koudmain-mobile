import { apiFetch } from '@koudmain/ui';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export const authService = {
  login: async (email: string, password: string) => {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password, targetApp: 'worker' },
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
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_worker_active: boolean;
    is_employer_active: boolean;
  }) => {
    return apiFetch<LoginResponse>('/auth/register', {
      method: 'POST',
      body: data,
    });
  },
};
