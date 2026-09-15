import EmptyPublications from '@/components/EmptyPublications';
import { AppScrollView } from '@koudmain/ui/components/layout/AppScrollView';

export default function Publication() {
  return (
    <AppScrollView
      contentContainerClassName="bg-white pt-20"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <EmptyPublications />
    </AppScrollView>
  );
}
