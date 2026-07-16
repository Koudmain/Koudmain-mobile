import React from 'react';
import { View, Text } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export interface OfferInfoItem {
  icon: keyof typeof Feather.glyphMap | keyof typeof FontAwesome6.glyphMap;
  iconLibrary: 'Feather' | 'FontAwesome6';
  text: string;
}

interface OfferInfoListProps {
  items: OfferInfoItem[];
}

export function OfferInfoList({ items }: OfferInfoListProps) {
  return (
    <View className="px-6 mb-8 gap-y-4">
      {items.map((item, index) => (
        <View key={index} className="flex-row items-center gap-x-4">
          <View className="w-8 items-center justify-center">
            {item.iconLibrary === 'Feather' ? (
              <Feather
                name={item.icon as keyof typeof Feather.glyphMap}
                size={24}
                color={colors.secondary.DEFAULT}
              />
            ) : (
              <FontAwesome6
                name={item.icon as keyof typeof FontAwesome6.glyphMap}
                size={24}
                color={colors.secondary.DEFAULT}
              />
            )}
          </View>
          <Text className="text-lg text-primary dark:text-white flex-1">{item.text}</Text>
        </View>
      ))}
    </View>
  );
}
