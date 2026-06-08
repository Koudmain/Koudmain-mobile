import { Redirect } from 'expo-router';
import { useSession } from '@koudmain/ui/context/SessionContext';

export default function Index() {
  const { session } = useSession();

  if (session) {
    return <Redirect href="/(tabs)/Offers" />;
  } else {
    return <Redirect href="/auth/Connection" />;
  }
}
