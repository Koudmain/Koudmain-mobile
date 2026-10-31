import { router, useLocalSearchParams } from 'expo-router';
import { CompanyProfileScreen } from '@koudmain/ui/screens';

export default function CompanyProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <CompanyProfileScreen
      companyId={Number(id)}
      onMissionPress={(publicationId) => router.push(`/offer/${publicationId}`)}
    />
  );
}
