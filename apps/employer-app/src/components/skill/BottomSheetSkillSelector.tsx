import { Text } from '@koudmain/ui/gluestack';
import { View } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SearchBarBottomSheet, SearchBarProps } from '@/components/tools/SearchBar';
import { CustomButton } from '@/components/button/LongButton';
import CategorySection from './SkillByCategory';
import { Skill } from '@/types/skill';
import React, { useCallback } from 'react';
import { SkillCategory } from '@/types/skill-category';

interface BottomSheetSkillSelectorProps {
  skills_skill_category: SkillCategory[];
  isLoading_skill_category: boolean;
  error_skill_category: string | null;
  searchProps: SearchBarProps;
  searchQuery: string;
  tempSelectedSkills: Skill[];
  setTempSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  setCompetencesList: React.Dispatch<React.SetStateAction<Skill[]>>;
}

export function BottomSheetSkillSelector({
  skills_skill_category,
  isLoading_skill_category,
  error_skill_category,
  searchProps,
  searchQuery,
  tempSelectedSkills,
  setTempSelectedSkills,
  bottomSheetRef,
  setCompetencesList,
}: BottomSheetSkillSelectorProps) {
  const handleSkillSelectionChange = useCallback(
    (skill: Skill, isSelected: boolean) => {
      setTempSelectedSkills((prev) => {
        if (isSelected) {
          if (!prev.some((s) => s.id === skill.id)) {
            return [...prev, skill];
          }
          return prev;
        } else {
          return prev.filter((s) => s.id !== skill.id);
        }
      });
    },
    [setTempSelectedSkills],
  );

  const handleCloseBottomSheet = () => {
    setCompetencesList((prev) => {
      const newSkills = [...prev];
      tempSelectedSkills.forEach((skill) => {
        if (!newSkills.some((s) => s.id === skill.id)) {
          newSkills.push(skill);
        }
      });
      return newSkills;
    });
    setTempSelectedSkills([]);
    bottomSheetRef?.current?.close();
  };

  return (
    <BottomSheetScrollView
      className="w-full flex-1 pl-6 pr-6 pt-4"
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6 flex-row items-center gap-2">
        <Text className="text-primary text-2xl font-bold font-inter">Ajouter des compétences</Text>
      </View>
      <SearchBarBottomSheet className="rounded-[10] mb-4" onFocus={() => {}} {...searchProps} />
      {isLoading_skill_category ? (
        <Text className="text-center text-gray-500">
          Chargement des catégories de compétences...
        </Text>
      ) : error_skill_category ? (
        <Text className="text-center text-red-500">{error_skill_category}</Text>
      ) : skills_skill_category.length === 0 ? (
        <Text className="text-center text-gray-500">
          Aucune catégorie de compétence disponible.
        </Text>
      ) : (
        <View className="flex-column gap-2">
          {skills_skill_category.map((skill_category) => (
            <CategorySection
              key={skill_category.id}
              category={skill_category}
              searchQuery={searchQuery}
              onSkillSelectionChange={handleSkillSelectionChange}
            />
          ))}
        </View>
      )}
      <View className="w-full pt-4">
        <CustomButton
          label={`Valider ${tempSelectedSkills.length > 0 ? `(${tempSelectedSkills.length})` : ''}`}
          onPress={handleCloseBottomSheet}
        />
      </View>
    </BottomSheetScrollView>
  );
}
