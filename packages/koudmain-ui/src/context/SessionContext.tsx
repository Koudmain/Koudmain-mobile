import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/user';
import { userService } from '../api/user.api';
import { authService } from '../api/auth.api';
import { configureAuthRefresh } from '../utils/api';

const ACCESS_TOKEN_KEY = 'session';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: 'WORKER' | 'EMPLOYER';
    birthDate: string;
    workerProfile?: any;
    employerProfile?: any;
  }) => Promise<number>;
  verifyEmail: (userId: number, code: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  session: string | null;
  isLoading: boolean;
  user: User | null;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession doit être utilisé dans un SessionProvider');
  }
  return context;
}

interface SessionProviderProps {
  children: React.ReactNode;
  targetApp: 'employer' | 'worker';
  onSessionLoaded?: (token: string) => Promise<void>;
  onSessionCleared?: () => Promise<void>;
}

export function SessionProvider({ children, targetApp, onSessionLoaded, onSessionCleared }: SessionProviderProps) {
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setSession(null);
    setUser(null);
    if (onSessionCleared) {
      await onSessionCleared();
    }
  }, [onSessionCleared]);

  useEffect(() => {
    configureAuthRefresh({
      getRefreshToken: async () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      onAuthRefreshed: async ({ accessToken, refreshToken }) => {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        setSession(accessToken);
      },
      onAuthExpired: async () => {
        await clearSession();
      },
    });

    return () => {
      configureAuthRefresh(null);
    };
  }, [clearSession]);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

        if (token && refreshToken) {
          setSession(token);
          const userData = await userService.getMe(token);
          setUser(userData);
          if (onSessionLoaded) {
            await onSessionLoaded(token);
          }
        } else {
          await clearSession();
        }
      } catch (e) {
        console.error('Session obsolète ou invalide, nettoyage...', e);
        await clearSession();
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, [clearSession, onSessionLoaded]);

  const refreshUser = async () => {
    if (!session) return;
    try {
      const userData = await userService.getMe(session);
      setUser(userData);
    } catch (e) {
      console.error('Erreur refresh user:', e);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: 'WORKER' | 'EMPLOYER';
    birthDate: string;
    workerProfile?: any;
    employerProfile?: any;
  }) => {
    try {
      const res = await authService.register(data);
      return res.userId;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
  };

  const verifyEmail = async (userId: number, code: string) => {
    try {
      const response = await authService.verifyEmail(userId, code);
      if (!response?.accessToken || !response?.refreshToken) {
        throw new Error("Jetons invalides après vérification.");
      }

      const token = response.accessToken;
      const refreshToken = response.refreshToken;

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      setSession(token);

      const userData = await userService.getMe(token);
      setUser(userData);

      if (onSessionLoaded) {
        await onSessionLoaded(token);
      }
      return true;
    } catch (error) {
      console.error("Erreur vérification email:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password, targetApp);

      if (!response?.accessToken || typeof response.accessToken !== 'string') {
        throw new Error("Le serveur n'a pas renvoyé de jeton (token) valide.");
      }
      if (!response?.refreshToken || typeof response.refreshToken !== 'string') {
        throw new Error("Le serveur n'a pas renvoyé de refresh token valide.");
      }

      const token = response.accessToken;
      const refreshToken = response.refreshToken;

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      setSession(token);

      const userData = await userService.getMe(token);
      setUser(userData);

      if (onSessionLoaded) {
        await onSessionLoaded(token);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      console.error('Erreur de connexion détaillée:', errorMessage);
      await clearSession();
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (session) {
        await authService.logout(session);
      }
    } catch (error) {
      console.error('Erreur logout API:', error);
    } finally {
      await clearSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{ register, verifyEmail, signIn, signOut, session, user, isLoading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
