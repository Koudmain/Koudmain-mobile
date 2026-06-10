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
  role: 'WORKER' | 'EMPLOYER';
  phoneNumber?: string;
  birthDate?: string;
  workerProfile?: {
    skill_category_id: number;
    bio?: string;
    work_radius?: number;
    address?: {
      street_number?: string;
      street_name: string;
      zip_code: string;
      city: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
  };
  employerProfile?: {
    company_name: string;
    owner_position: 'OWNER' | 'DIRECTOR' | 'MANAGER' | 'HR' | 'OTHER';
    desired_trade_ids: number[];
    address?: {
      street_number?: string;
      street_name: string;
      zip_code: string;
      city: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
  };
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
    return apiFetch<{ userId: number; message: string }>('/auth/register', {
      method: 'POST',
      body: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        phone_number: data.phoneNumber || '0600000000',
        birth_date: data.birthDate || '1990-01-01',
        workerProfile: data.workerProfile,
        employerProfile: data.employerProfile,
      },
    });
  },

  verifyEmail: async (userId: number, code: string) => {
    return apiFetch<LoginResponse>('/auth/verify-email', {
      method: 'POST',
      body: { userId, code },
    });
  },

  resendVerification: async (userId: number) => {
    return apiFetch<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: { userId },
    });
  },
};
