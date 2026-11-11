import { Pressable, Text, useColorScheme, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';

// Favorites are not stored by the API yet: show an empty state rather than invented offers.
export default function YourOffers() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';

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

      <View className="flex-1 items-center justify-center px-8">
        <Feather
          name="heart"
          size={40}
          color={isDark ? colors.primary.disabled : colors.primary.hover}
        />
        <Text className="text-primary dark:text-primary-content text-lg font-semibold mt-4 text-center">
          Aucun favori pour le moment
        </Text>
        <Text className="text-primary-hover dark:text-primary-disabled text-sm mt-2 text-center">
          Les offres que vous mettrez en favori apparaîtront ici.
        </Text>
      </View>
    </View>
  );
}
