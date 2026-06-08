import { apiFetch } from '@koudmain/ui/utils/api';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isWorkerActive?: boolean;
  isEmployerActive?: boolean;
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
      body: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        is_worker_active: data.isWorkerActive,
        is_employer_active: data.isEmployerActive,
      },
    });
  },
};
