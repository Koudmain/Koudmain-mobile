import { apiFetch } from '@koudmain/ui/utils/api';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type OwnerPosition = 'OWNER' | 'DIRECTOR' | 'MANAGER' | 'HR' | 'OTHER';

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'WORKER' | 'EMPLOYER';
  phoneNumber?: string;
  birthDate?: string;
  workerProfile?: {
    skillCategoryIds: number[];
    bio?: string;
    workRadius?: number;
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
    companyName: string;
    companyType: string;
    ownerPosition: OwnerPosition;
    desiredJobIds: number[];
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
      body: { refreshToken },
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
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        phoneNumber: data.phoneNumber || '0600000000',
        birthDate: data.birthDate || '1990-01-01',
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
