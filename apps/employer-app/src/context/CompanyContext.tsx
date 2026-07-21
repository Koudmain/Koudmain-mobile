import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Companies } from '@/types/companies';
import { companiesService } from '@/api/companies.api';
import { useSession } from '@koudmain/ui/context/SessionContext';

interface CompanyContextType {
  companies: Companies[];
  activeCompanyId: string | null;
  changeCompany: (id: string) => Promise<void>;
  isLoadingCompanies: boolean;
  loadCompanies: (token: string) => Promise<void>;
  clearCompanies: () => void;
}

export const companyContext = createContext<CompanyContextType | null>(null);

export function useCompany() {
  const context = useContext(companyContext);
  if (!context) {
    throw new Error('useCompany doit être utilisé dans un CompanyProvider');
  }
  return context;
}

export function CompanyProvider({ children }: React.PropsWithChildren) {
  const { session } = useSession();
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const clearCompanies = useCallback(() => {
    setCompanies([]);
    setActiveCompanyId(null);
    SecureStore.deleteItemAsync('selected_company_id').catch((err) => console.error(err));
  }, []);

  const loadCompanies = useCallback(async (token: string) => {
    setIsLoadingCompanies(true);
    try {
      const companiesData = await companiesService.getMyCompanies(token);
      setCompanies(companiesData);

      const savedCompanyId = await SecureStore.getItemAsync('selected_company_id');
      const firstCompanyWithId = companiesData.find((c) => c != null && typeof c.id === 'number');

      if (
        savedCompanyId &&
        companiesData.some((c) => c != null && String(c.id) === savedCompanyId)
      ) {
        setActiveCompanyId(savedCompanyId);
      } else if (firstCompanyWithId) {
        const defaultId = String(firstCompanyWithId.id);
        setActiveCompanyId(defaultId);
        await SecureStore.setItemAsync('selected_company_id', defaultId);
      } else {
        setActiveCompanyId(null);
        await SecureStore.deleteItemAsync('selected_company_id');
      }
    } catch (e) {
      console.error('Erreur lors du chargement des entreprises:', e);
    } finally {
      setIsLoadingCompanies(false);
    }
  }, []);

  const changeCompany = async (id: string) => {
    setActiveCompanyId(id);
    await SecureStore.setItemAsync('selected_company_id', id);
  };

  useEffect(() => {
    if (session) {
      loadCompanies(session);
    } else {
      clearCompanies();
    }
  }, [session, clearCompanies, loadCompanies]);

  return (
    <companyContext.Provider
      value={{
        companies,
        activeCompanyId,
        changeCompany,
        isLoadingCompanies,
        loadCompanies,
        clearCompanies,
      }}
    >
      {children}
    </companyContext.Provider>
  );
}
