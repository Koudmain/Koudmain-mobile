import { useLocalSearchParams } from 'expo-router';
import { WorkerProfileScreen } from '@koudmain/ui/screens';

export default function WorkerProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <WorkerProfileScreen workerId={Number(id)} />;
}
