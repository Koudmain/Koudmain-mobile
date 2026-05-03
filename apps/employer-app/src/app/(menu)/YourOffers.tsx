import { useMemo, useState } from 'react';
import { Pressable, Text, useColorScheme, View } from 'react-native';

import { LIST_FAV } from '@/constants/fake_data';

import OffreEmploiCard from '@/components/card/OffreEmploiCard';
import FiltersOffers from '@/components/filters/FiltersOffers';
import { Shadow } from 'react-native-shadow-2';
import SearchBar from '@/components/tools/SearchBar';
import { normalizeText } from '@/utils/text';
import { colors } from '@/constants/theme';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function YourOffers() {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';

  const filteredOffers = useMemo(() => {
    const normalizedQuery = normalizeText(searchText.trim());
    const queryTokens = normalizedQuery.length > 0 ? normalizedQuery.split(/\s+/) : [];

    return LIST_FAV.filter((offre) => {
      const matchesJob =
        selectedJobs.length === 0 ||
        selectedJobs.some((jobId) => Array.isArray(offre.job) && offre.job.includes(jobId));

      const searchableText = normalizeText(
        [offre.name, offre.city, offre.zip, ...(offre.competence ?? [])].join(' '),
      );
      const matchesSearch = queryTokens.every((token) => searchableText.includes(token));

      return matchesJob && matchesSearch;
    });
  }, [searchText, selectedJobs]);

  return (
    <View className="bg-white dark:bg-primary bg-surface flex-1">
      <View className="flex-row mb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <Feather
            name="arrow-left"
            size={28}
            color={isDark ? colors.primary.content : colors.primary.DEFAULT}
          />
        </Pressable>
        <Text className="dark:text-primary-content text-4xl font-bold px-6">Vos Favoris</Text>
      </View>

      <SearchBar value={searchText} onChangeText={setSearchText} />

      <FiltersOffers selectedIds={selectedJobs} onChange={setSelectedJobs} />

      <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
        {filteredOffers.map((offre, index) => (
          <Shadow
            key={`${offre.name}-${offre.date}-${index}`}
            startColor={isDark ? '#FFFFFF10' : '#00000010'}
            style={{
              borderRadius: 24,
              width: '100%',
              marginBottom: 16,
              backgroundColor: isDark ? colors.background.dark : colors.background.light,
            }}
          >
            <OffreEmploiCard
              key={`${offre.name}-${offre.date}-${index}`}
              id={offre.id}
              name={offre.name}
              image_profile={offre.image_profile}
              city={offre.city}
              zip={offre.zip}
              rate={offre.rate}
              number_rate={offre.number_rate}
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
      </ScrollView>
    </View>
  );
}
