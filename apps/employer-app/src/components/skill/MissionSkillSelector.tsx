import { Text } from '@/components/ui/text';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import CompetenceCard from '@/components/card/CompetenceCard';
import { Skill } from '@/types/skill';

export interface MissionSkillSelectorProps {
  competencesList: Skill[];
  onDeleteCompetence: (competenceId: number) => void;
  handleOpenBottomSheet: () => void;
}

export function MissionSkillSelector({
  competencesList,
  onDeleteCompetence,
  handleOpenBottomSheet,
}: MissionSkillSelectorProps) {
  return (
    <View className="flex-row flex-wrap">
      <Text className=" mb-3 font-inter font-bold text-primary text-xl">Compétences</Text>
      <View className="flex-row items-center w-full mt-2 mb-4">
        <TouchableOpacity className="mr-2" onPress={handleOpenBottomSheet}>
          <CompetenceCard
            comp="+"
            size="lg"
            backgroundColor="#EFEFEF"
            accentColor="#333333"
            deletable={false}
          />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingRight: 48 }}
          className="flex-1"
        >
          {competencesList.map((competence, index) => (
            <CompetenceCard
              key={index}
              comp={competence.name}
              size="lg"
              deletable={true}
              onDelete={() => onDeleteCompetence(competence.id)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
