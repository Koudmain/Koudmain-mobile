import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export interface RequirementItem {
  iconType: 'outfit' | 'language';
  text: string;
}

interface OfferRequirementsProps {
  requirements: RequirementItem[];
  sectionTitle?: string;
}

export function OfferRequirements({
  requirements,
  sectionTitle = "Ce qu'il vous faut",
}: OfferRequirementsProps) {
  if (!requirements || requirements.length === 0) return null;

  return (
    <View className="px-6 mb-24">
      <Text className="text-xl font-bold text-primary dark:text-white mb-6">{sectionTitle}</Text>

      <View className="gap-y-6">
        {requirements.map((req, index) => (
          <View key={index} className="flex-row items-center gap-x-4">
            <View className="w-10 items-center justify-center">
              {req.iconType === 'outfit' ? (
                <FontAwesome5 name="user-tie" size={28} color={colors?.secondary.DEFAULT} />
              ) : (
                <Ionicons name="language" size={32} color={colors?.secondary.DEFAULT} />
              )}
            </View>
            <Text className="text-base text-primary dark:text-white flex-1">{req.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
