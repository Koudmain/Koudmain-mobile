import { Text } from '@koudmain/ui/gluestack';
import { View } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SearchBarBottomSheet, SearchBarProps } from '@koudmain/ui/components/tools/SearchBar';
import { CustomButton } from '@/components/button/LongButton';
import CategorySection from './SkillByCategory';
import { Skill } from '@/types/skill';
import React, { useCallback } from 'react';
import { SkillCategory } from '@/types/skillCategory';

interface BottomSheetSkillSelectorProps {
  skillsSkillCategory: SkillCategory[];
  isLoadingSkillCategory: boolean;
  errorSkillCategory: string | null;
  searchProps: SearchBarProps;
  searchQuery: string;
  tempSelectedSkills: Skill[];
  setTempSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  setCompetencesList: React.Dispatch<React.SetStateAction<Skill[]>>;
}

export function BottomSheetSkillSelector({
  skillsSkillCategory,
  isLoadingSkillCategory,
  errorSkillCategory,
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
      {isLoadingSkillCategory ? (
        <Text className="text-center text-gray-500">
          Chargement des catégories de compétences...
        </Text>
      ) : errorSkillCategory ? (
        <Text className="text-center text-red-500">{errorSkillCategory}</Text>
      ) : skillsSkillCategory.length === 0 ? (
        <Text className="text-center text-gray-500">
          Aucune catégorie de compétence disponible.
        </Text>
      ) : (
        <View className="flex-column gap-2">
          {skillsSkillCategory.map((skillCategory) => (
            <CategorySection
              key={skillCategory.id}
              category={skillCategory}
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
