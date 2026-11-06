import { router } from 'expo-router';
import { WorkerProfileScreen } from '@koudmain/ui/screens';

export default function MyProfilePage() {
  return (
    <WorkerProfileScreen
      workerId="me"
      onEdit={() => router.push('/my-profile/Edit')}
      onReviewAuthorPress={(companyId) => router.push(`/company/${companyId}`)}
    />
  );
}
