import React from 'react';
import { View, Text } from 'react-native';

interface OfferTitleProps {
  title: string;
  isAvailable?: boolean;
}

export function OfferTitle({ title, isAvailable = true }: OfferTitleProps) {
  return (
    <View className="flex-row items-center justify-between px-6 mb-6">
      <Text className="text-3xl font-bold text-primary dark:text-white max-w-[70%]">{title}</Text>
      {isAvailable && (
        <View className="bg-[#27AA45] px-3 py-1.5 rounded-lg">
          <Text className="text-white font-bold text-md">Disponible</Text>
        </View>
      )}
    </View>
  );
}
