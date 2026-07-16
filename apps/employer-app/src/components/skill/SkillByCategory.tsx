import { Text } from '@koudmain/ui/gluestack';
import { View, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { useGetSkillByCategoryId } from '@/hooks/useGetSkillByCategoryId';
import CompetenceCardSelectable from '@koudmain/ui/components/card/CompetenceCardSelectable';
import { SkillCategory } from '@/types/skillCategory';
import { Skill } from '@/types/skill';

const CategorySection = ({
  category,
  onSkillSelectionChange,
  searchQuery = '',
}: {
  category: SkillCategory;
  onSkillSelectionChange?: (skill: Skill, selected: boolean) => void;
  searchQuery?: string;
}) => {
  const { mutateSkill, skillsSkill, isLoadingSkill, errorSkill } = useGetSkillByCategoryId();

  useEffect(() => {
    void mutateSkill(category.id);
  }, [category.id, mutateSkill]);

  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const normalizedSearchQuery = removeAccents(searchQuery.toLowerCase().trim());

  const filteredSkills = skillsSkill.filter((skill: Skill) =>
    removeAccents(skill.name.toLowerCase()).includes(normalizedSearchQuery),
  );

  if (!isLoadingSkill && !errorSkill && filteredSkills.length === 0 && searchQuery.length > 0) {
    return null;
  }

  return (
    <View className="w-full">
      <Text className="text-primary font-inter font-bold text-lg">{category.name}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-2 mb-4"
        contentContainerStyle={{ flexDirection: 'row', gap: 8 }}
      >
        {isLoadingSkill ? (
          <Text className="text-center text-gray-500">Chargement des compétences...</Text>
        ) : errorSkill ? (
          <Text className="text-center text-red-500">{errorSkill}</Text>
        ) : filteredSkills.length === 0 ? (
          <Text className="text-center text-gray-500">
            Aucune compétence pour la catégorie {category.name}.
          </Text>
        ) : (
          filteredSkills.map((skill: Skill) => (
            <CompetenceCardSelectable
              key={skill.id}
              comp={skill.name}
              size="lg"
              onChange={(selected: boolean) => onSkillSelectionChange?.(skill, selected)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default CategorySection;
