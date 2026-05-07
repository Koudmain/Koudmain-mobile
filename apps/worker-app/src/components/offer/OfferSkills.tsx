import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/theme';
import CompetenceCard from '@/components/card/CompetenceCard';

interface OfferSkillsProps {
  skills: string[];
  sectionTitle?: string;
}

export function OfferSkills({ skills, sectionTitle = 'Compétences' }: OfferSkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <View className="px-6 mb-8">
      <Text className="text-xl font-bold text-primary dark:text-white mb-4">{sectionTitle}</Text>
      <View className="flex-row flex-wrap gap-3">
        {skills.map((skill, index) => (
          <CompetenceCard
            key={index}
            comp={skill}
            accentColor={colors.secondary.DEFAULT}
            size="lg"
          />
        ))}
      </View>
    </View>
  );
}
