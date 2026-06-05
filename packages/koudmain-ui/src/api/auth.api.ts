import { apiFetch } from '@koudmain/ui/utils/api';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

type RegisterData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_worker_active?: boolean;
  is_employer_active?: boolean;
};

export const authService = {
  login: async (email: string, password: string, targetApp: 'employer' | 'worker') => {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password, targetApp },
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

  register: async (data: RegisterData) => {
    return apiFetch<LoginResponse>('/auth/register', {
      method: 'POST',
      body: data,
    });
  },
};
