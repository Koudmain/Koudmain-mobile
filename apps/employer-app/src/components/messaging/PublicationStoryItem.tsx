import React from 'react';
import { formatPublicationDate } from '@koudmain/ui/utils/date';
import { Shadow } from 'react-native-shadow-2';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground, TouchableOpacity, View, Text } from 'react-native';
import { cnFusion } from '@koudmain/ui/utils/cnFusion';
import { colors } from '@/constants/theme';

export type PublicationTheme = 'service' | 'plonge' | 'cuisine' | 'bar' | 'accueil';

export interface PublicationStory {
  id: number;
  title: string;
  restaurant_name: string;
  image_url: string;
  start_date: string;
  duration: string;
  theme: PublicationTheme;
  has_unread: boolean;
}

interface PublicationStoryItemProps {
  item: PublicationStory;
  isActive: boolean;
  onPress: () => void;
}

const themeIcons: Record<PublicationTheme, keyof typeof MaterialCommunityIcons | any> = {
  service: 'silverware-variant',
  plonge: 'dishwasher',
  cuisine: 'chef-hat',
  bar: 'glass-cocktail',
  accueil: 'account-check',
};

const PublicationStoryItem = ({ item, isActive, onPress }: PublicationStoryItemProps) => {
  const displayDate = formatPublicationDate(item.start_date);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="items-center mr-5 w-24 mt-4">
      <View
        className={cnFusion(
          'w-20 h-20 rounded-full p-0.5 border-2',
          isActive ? 'border-secondary' : 'border-neutral-200 dark:border-neutral-700',
        )}
      >
        <ImageBackground
          source={{ uri: item.image_url }}
          className="flex-1 rounded-full overflow-hidden"
          imageStyle={{ borderRadius: 100 }}
        >
          <View className="absolute inset-0 bg-black/40 items-center justify-end">
            <MaterialCommunityIcons
              name={themeIcons[item.theme]}
              style={{ marginBottom: 12 }}
              size={26}
              color="white"
            />
          </View>
        </ImageBackground>

        <View className="absolute -top-4 -left-2 w-24">
          <Shadow distance={3} startColor={colors.shadow.light} offset={[0, 2]}>
            <View className="bg-white dark:bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-100 dark:border-neutral-700 max-w-[85px]">
              <Text
                className="text-[9px] font-bold text-center text-neutral-900 dark:text-white"
                numberOfLines={3}
              >
                {item.title}
              </Text>
            </View>
          </Shadow>
        </View>
      </View>

      <View className="mt-2 items-center">
        <Text className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100 uppercase">
          {displayDate}
        </Text>
        <Text className="text-[10px] text-neutral-500 font-medium">{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PublicationStoryItem;
