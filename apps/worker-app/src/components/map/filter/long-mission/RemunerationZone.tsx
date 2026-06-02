import { Text, useColorScheme, View } from 'react-native';
import { colors } from '@/constants/theme';
import LabeledIconInput from '@/components/form/LabeledIconInput';
import { FontAwesome5 } from '@expo/vector-icons';
import InfoHint from '@koudmain/ui/components/utils/InfoHint';

export interface FRemunerationLongMissionFilter {
  active: boolean;
  hourlyRate: string;
  monthlySalary: string;
}

export const defaultFRemunerationLongMissionFilter: FRemunerationLongMissionFilter = {
  active: false,
  hourlyRate: '0',
  monthlySalary: '0',
};

interface RemunerationLongZoneProps {
  filters: FRemunerationLongMissionFilter;
  setFilters: (filters: FRemunerationLongMissionFilter) => void;
}

export default function RemunerationZone({ filters, setFilters }: RemunerationLongZoneProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <View className="mb-2 flex flex-row items-center gap-2">
        <Text className="text-primary dark:text-white text-base font-bold">
          Rémunération minimum
        </Text>
        <InfoHint
          icon={
            <FontAwesome5
              name="info-circle"
              size={14}
              color={isDark ? colors.primary[200] : colors.primary[400]}
            />
          }
          texts={[
            'Indiquez les rémunérations minimales que doit proposer la mission pour être affichée.',
            'Les missions peuvent proposer une rémunération horaire ou mensuelle selon leur durée, indiquez les deux si vous souhaitez voir tous les types de missions.',
            'Certaines missions peuvent ne pas afficher de rémunération, dans ce cas elles ne seront pas filtrées sur ce critère.',
          ]}
        />
      </View>
      <View className="space-y-3 mb-4">
        <LabeledIconInput
          className="mb-4"
          iconName="money-check-alt"
          label="Taux horaire minimum"
          value={filters.hourlyRate}
          onChangeText={(text) => setFilters({ ...filters, hourlyRate: text })}
          keyboardType="numeric"
          iconSize={20}
          iconColor={isDark ? colors.primary[200] : colors.primary[400]}
          suffix="€ / h"
        />

        <LabeledIconInput
          iconName="money-check-alt"
          label="Salaire mensuel minimum"
          value={filters.monthlySalary}
          onChangeText={(text) => setFilters({ ...filters, monthlySalary: text })}
          keyboardType="numeric"
          iconSize={20}
          iconColor={isDark ? colors.primary[200] : colors.primary[400]}
          suffix="€ / mois"
        />
      </View>
    </>
  );
}
