import { router } from 'expo-router';
import { CompanyProfileScreen } from '@koudmain/ui/screens';
import { useCompany } from '@/context/CompanyContext';

export default function MyCompanyPage() {
  const { companies, activeCompanyId } = useCompany();
  const isOwner =
    companies.find((company) => String(company.id) === activeCompanyId)?.role === 'OWNER';

  return (
    <CompanyProfileScreen
      companyId={Number(activeCompanyId)}
      onEdit={isOwner ? () => router.push('/my-company/Edit') : undefined}
      onReviewAuthorPress={(workerId) => router.push(`/worker/${workerId}`)}
    />
  );
}
