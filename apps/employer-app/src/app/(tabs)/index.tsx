import { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Text } from '@koudmain/ui/gluestack';
import { AppScrollView } from '@koudmain/ui/components/layout/AppScrollView';
import { useSession } from '@koudmain/ui/context/SessionContext';
import PubliCards from '@/components/PubliCards';
import EmptyPublications from '@/components/EmptyPublications';
import { useCompany } from '@/context/CompanyContext';
import { useGetPublications } from '@/hooks/useGetPublications';
import { colors } from '@/constants/theme';
import { formatPublicationDateLabel, formatPublicationTimeLabel } from '@/utils/publicationFormat';

export default function Publication() {
  const { session } = useSession();
  const { activeCompanyId } = useCompany();
  const { mutatePublications, publications, isLoadingPublications, errorPublications } =
    useGetPublications();

  useFocusEffect(
    useCallback(() => {
      if (session) {
        void mutatePublications();
      }
    }, [session, mutatePublications]),
  );

  const companyPublications = publications
    .filter((pub) => activeCompanyId != null && pub.companyId === Number(activeCompanyId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (isLoadingPublications && companyPublications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white pt-20">
        <ActivityIndicator color={colors.secondary.DEFAULT} />
      </View>
    );
  }

  if (errorPublications && companyPublications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white pt-20 px-8">
        <Text className="text-sm text-gray-500 text-center">
          Impossible de récupérer vos publications. Réessayez plus tard.
        </Text>
      </View>
    );
  }

  if (companyPublications.length === 0) {
    return (
      <AppScrollView contentContainerClassName="bg-white pt-20 flex-grow">
        <EmptyPublications />
      </AppScrollView>
    );
  }

  return (
    <AppScrollView contentContainerClassName="items-center py-4 gap-4 bg-white pt-20">
      {companyPublications.map((pub) => (
        <PubliCards
          key={pub.id}
          data={{
            title: pub.title,
            date: formatPublicationDateLabel(pub.starting_date),
            description: pub.description,
            time: formatPublicationTimeLabel(pub.starting_date, pub.ending_date),
            views: Number(pub.views) || 0,
            clicks: Number(pub.clicks) || 0,
            competences: pub.skills?.map((skill) => skill.name) ?? [],
          }}
        />
      ))}
    </AppScrollView>
  );
}
