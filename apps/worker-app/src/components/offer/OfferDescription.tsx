import React from 'react';
import { View, Text } from 'react-native';

interface OfferDescriptionProps {
  description: string;
  sectionTitle?: string;
}

export function OfferDescription({
  description,
  sectionTitle = 'Description de la mission',
}: OfferDescriptionProps) {
  return (
    <View className="px-6 mb-8">
      <Text className="text-xl font-bold text-primary dark:text-white mb-3">{sectionTitle}</Text>
      <Text className="text-base text-gray-700 dark:text-white/80 leading-6">{description}</Text>
    </View>
  );
}
