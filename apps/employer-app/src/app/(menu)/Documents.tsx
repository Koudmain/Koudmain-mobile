import React from 'react';
import { useRouter } from 'expo-router';
import { DocumentsScreen } from '@koudmain/ui/screens';
import { useCompany } from '@/context/CompanyContext';

export default function DocumentsPage() {
  const router = useRouter();
  const { activeCompanyId } = useCompany();

  return (
    <DocumentsScreen
      companyId={activeCompanyId ? Number(activeCompanyId) : null}
      onBack={() => router.back()}
    />
  );
}
