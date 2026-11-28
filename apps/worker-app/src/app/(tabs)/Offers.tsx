import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Text, useColorScheme, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Shadow } from 'react-native-shadow-2';

import OffreEmploiCard from '@koudmain/ui/components/card/OffreEmploiCard';
import FiltersOffers from '@/components/filters/FiltersOffers';
import { AppScrollView } from '@koudmain/ui/components/layout/AppScrollView';
import SearchBar from '@koudmain/ui/components/tools/SearchBar';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { normalizeText } from '@koudmain/ui/utils/text';
import { colors } from '@/constants/theme';
import { useGetPublications } from '@/hooks/useGetPublications';
import { mapPublicationToOfferCard } from '@/utils/offerMapper';

export default function Offers() {
  const { session } = useSession();
  const { mutatePublications, publications, isLoadingPublications, errorPublications } =
    useGetPublications();
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  useFocusEffect(
    useCallback(() => {
      if (session) {
        void mutatePublications();
      }
    }, [session, mutatePublications]),
  );

  const mappedOffers = useMemo(
    () => publications.map((pub) => mapPublicationToOfferCard(pub)),
    [publications],
  );

  const filteredOffers = useMemo(() => {
    const normalizedQuery = normalizeText(searchText.trim());
    const queryTokens = normalizedQuery.length > 0 ? normalizedQuery.split(/\s+/) : [];

    return mappedOffers.filter((offre) => {
      const matchesJob =
        selectedJobs.length === 0 ||
        selectedJobs.some((jobId) =>
          offre.job.some((j) => normalizeText(j).includes(normalizeText(jobId))),
        );

      const searchableText = normalizeText(
        [offre.name, offre.title, offre.city, offre.zip, ...(offre.competence ?? [])].join(' '),
      );
      const matchesSearch = queryTokens.every((token) => searchableText.includes(token));

      return matchesJob && matchesSearch;
    });
  }, [mappedOffers, searchText, selectedJobs]);

  return (
    <View className="bg-white dark:bg-primary flex-1">
      <Text className="dark:text-white text-4xl font-bold mb-4 px-6">Offre d&apos;Emploi</Text>

      <SearchBar
        value={searchText}
        placeholder="Rechercher une offre..."
        onChangeText={setSearchText}
      />

      <FiltersOffers selectedIds={selectedJobs} onChange={setSelectedJobs} />

      {isLoadingPublications && mappedOffers.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.secondary.DEFAULT} size="large" />
        </View>
      ) : errorPublications && mappedOffers.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-sm text-gray-500 dark:text-white/70 text-center">
            Impossible de récupérer les offres pour le moment.
          </Text>
        </View>
      ) : filteredOffers.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-sm text-gray-500 dark:text-white/70 text-center">
            Aucune offre disponible.
          </Text>
        </View>
      ) : (
        <AppScrollView className="p-4" showsVerticalScrollIndicator={false}>
          {filteredOffers.map((offre, index) => (
            <Shadow
              key={`${offre.id}-${index}`}
              startColor={isDark ? colors.shadow.dark : colors.shadow.light}
              style={{
                borderRadius: 24,
                width: '100%',
                marginBottom: 16,
                backgroundColor: isDark ? colors.background.dark : colors.background.light,
              }}
            >
              <OffreEmploiCard
                id={offre.id}
                name={offre.name}
                imageProfile={offre.image_profile}
                city={offre.city}
                zip={offre.zip}
                rate={offre.rate}
                numberRate={offre.number_rate}
                title={offre.title}
                wage={offre.wage}
                date={offre.date}
                begin={offre.begin}
                duration={offre.duration}
                competence={offre.competence}
                wishlist={offre.wishlist}
              />
            </Shadow>
          ))}
        </AppScrollView>
      )}
    </View>
  );
}
