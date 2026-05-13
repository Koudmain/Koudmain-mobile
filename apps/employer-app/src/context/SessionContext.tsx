import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { userService } from '@/api/user.api';
import { authService } from '@/api/auth.api';
import { companiesService } from '@/api/companies.api';
import { User } from '@/types/user';
import { Companies } from '@/types/companies';
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
    is_employer_active: boolean,
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  session: string | null;
  isLoading: boolean;
  user: User | null;
  companies: Companies[] | [];
  activeCompanyId: string | null;
  changeCompany: (id: string) => Promise<void>;
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
  const [companies, setCompanies] = useState<Companies[]>([]);

  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setSession(null);
    setUser(null);
    setCompanies([]);
    setActiveCompanyId(null);
  }, []);

  const loadInitialData = useCallback(async (token: string) => {
    const [userData, companiesData] = await Promise.all([
      userService.getMe(token),
      companiesService.getMyCompanies(token),
    ]);

    setUser(userData);
    setCompanies(companiesData);

    const savedCompanyId = await SecureStore.getItemAsync('selected_company_id');

    const firstCompanyWithId = companiesData.find((c) => c != null && typeof c.id === 'number');

    if (savedCompanyId) {
      setActiveCompanyId(savedCompanyId);
      return;
    }

    if (firstCompanyWithId) {
      const defaultId = String(firstCompanyWithId.id);
      setActiveCompanyId(defaultId);
      await SecureStore.setItemAsync('selected_company_id', defaultId);
    }
  }, []);

  const changeCompany = async (id: string) => {
    setActiveCompanyId(id);
    await SecureStore.setItemAsync('selected_company_id', id);
  };

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
        setCompanies([]);
        setActiveCompanyId(null);
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
          await loadInitialData(token);
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
  }, [clearSession, loadInitialData]);

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
    firstName: string,
    lastName: string,
    is_employer_active: boolean,
  ) => {
    try {
      await authService.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        is_employer_active,
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

      await loadInitialData(token);
    } catch (error: any) {
      console.error('Erreur de connexion détaillée:', error.message);
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
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      setSession(null);
      setUser(null);
      setCompanies([]);
      setActiveCompanyId(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        signIn,
        signOut,
        session,
        user,
        companies,
        activeCompanyId,
        isLoading,
        changeCompany,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
