import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { userService } from '@/api/user.api';
import { authService } from '@/api/auth.api';
import { companiesService } from '@/api/companies.api';
import { User } from '@/types/user';
import { Companies } from '@/types/companies';

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

  const loadInitialData = async (token: string) => {
    try {
      const [userData, companiesData] = await Promise.all([
        userService.getMe(token),
        companiesService.getMyCompanies(token),
      ]);

      setUser(userData);
      setCompanies(companiesData);

      const savedCompanyId = await SecureStore.getItemAsync('selected_company_id');

      if (savedCompanyId) {
        setActiveCompanyId(savedCompanyId);
      } else if (companiesData.length > 0) {
        const defaultId = companiesData[0].id.toString();
        setActiveCompanyId(defaultId);
        await SecureStore.setItemAsync('selected_company_id', defaultId);
      }
    } catch (e) {
      console.error('Erreur lors du chargement des données initiales:', e);
      refreshUser();
    }
  };

  const changeCompany = async (id: string) => {
    setActiveCompanyId(id);
    await SecureStore.setItemAsync('selected_company_id', id);
  };

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await SecureStore.getItemAsync('session');
        if (token) {
          setSession(token);
          await loadInitialData(token);
        }
      } catch (e) {
        console.error('Session obsolète ou invalide, nettoyage...', e);
        signOut();
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
      signOut();
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
      loadInitialData;
      const response = await authService.login(email, password);

      if (!response?.access_token || typeof response.access_token !== 'string') {
        throw new Error("Le serveur n'a pas renvoyé de jeton (token) valide.");
      }

      const token = response.access_token;

      await SecureStore.setItemAsync('session', token);
      setSession(token);

      const [userData, companiesData] = await Promise.all([
        userService.getMe(token),
        companiesService.getMyCompanies(token),
      ]);
      setUser(userData);
      setCompanies(companiesData);
      const defaultId = companiesData[0].id.toString();
      setActiveCompanyId(defaultId);
      await SecureStore.setItemAsync('selected_company_id', defaultId);
    } catch (error: any) {
      console.error('Erreur de connexion détaillée:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('session');
    setSession(null);
    setUser(null);
    setCompanies([]);
    setActiveCompanyId(null);
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
