import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { userService } from '@/api/user.api';
import { authService } from '@/api/auth.api';
import { User } from '@/types/user';
import { configureAuthRefresh } from '@/utils/api';

const ACCESS_TOKEN_KEY = 'session';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    is_worker_active: boolean,
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  session: string | null;
  isLoading: boolean;
  user: User | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession doit être utilisé dans un SessionProvider');
  }
  return context;
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    configureAuthRefresh({
      getRefreshToken: async () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      onAuthRefreshed: async ({ accessToken, refreshToken }) => {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        setSession(accessToken);
      },
      onAuthExpired: async () => {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        setSession(null);
        setUser(null);
      },
    });

    return () => {
      configureAuthRefresh(null);
    };
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

        if (token && refreshToken) {
          setSession(token);
          const userData = await userService.getMe(token);
          setUser(userData);
        } else {
          await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        }
      } catch (e) {
        console.error('Session obsolète ou invalide, nettoyage...', e);
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const refreshUser = async () => {
    if (!session) return;
    try {
      const userData = await userService.getMe(session);
      setUser(userData);
    } catch (e) {
      console.error('Erreur refresh user:', e);
    }
  };

  const register = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    is_worker_active: boolean,
  ) => {
    try {
      await authService.register({
        first_name,
        last_name,
        email,
        password,
        is_worker_active,
        is_employer_active: false,
      });
      return true;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);

      if (!response?.access_token || typeof response.access_token !== 'string') {
        throw new Error("Le serveur n'a pas renvoyé de jeton (token) valide.");
      }
      if (!response?.refresh_token || typeof response.refresh_token !== 'string') {
        throw new Error("Le serveur n'a pas renvoyé de refresh token valide.");
      }

      const token = response.access_token;
      const refreshToken = response.refresh_token;

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      setSession(token);

      const userData = await userService.getMe(token);
      setUser(userData);
    } catch (error: any) {
      console.error('Erreur de connexion détaillée:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (session) {
        await authService.logout(session);
      }
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Erreur logout API:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ register, signIn, signOut, session, user, isLoading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
