import { Text, useColorScheme, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import LabeledIconInput from '@/components/form/LabeledIconInput';
import InfoHint from '@koudmain/ui/components/utils/InfoHint';
import SliderIconInline from '@koudmain/ui/components/utils/SliderIconInline';

export interface FShortMissionFilter {
  remuneration: string;
  missionDuration: number;
  active: boolean;
  enabled: boolean;
}

export const defaultShortMissionFilter: FShortMissionFilter = {
  remuneration: '0',
  missionDuration: 0,
  active: false,
  enabled: true,
};

interface ShortMissionFilterProps {
  filters: FShortMissionFilter;
  setFilters: (filters: FShortMissionFilter) => void;
}

export default function ShortMissionFilter({ filters, setFilters }: ShortMissionFilterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const computeActive = (nextRemuneration: string, nextMissionDuration: number) => {
    return [
      nextRemuneration !== defaultShortMissionFilter.remuneration,
      nextMissionDuration !== defaultShortMissionFilter.missionDuration,
    ].filter(Boolean).length;
  };

  const handleRemunerationChange = (text: string) => {
    const nextFilters = {
      ...filters,
      remuneration: text,
    };

    setFilters({
      ...nextFilters,
      active: computeActive(text, nextFilters.missionDuration) > 0,
    });
  };

  const handleMissionDurationChange = (time: number) => {
    const nextFilters = {
      ...filters,
      missionDuration: time,
    };

    setFilters({
      ...nextFilters,
      active: computeActive(nextFilters.remuneration, time) > 0,
    });
  };

  const changeRemuneration = (text: string) => {
    const numericValue = text.replace(/[^0-9.,]/g, '').replace(',', '.');

    if (numericValue === '') {
      handleRemunerationChange('');
      return;
    }

    const parsedValue = Number.parseFloat(numericValue);

    if (Number.isNaN(parsedValue)) return;

    handleRemunerationChange(String(parsedValue));
  };

  const changeMinimumTime = (time: number) => {
    handleMissionDurationChange(time);
  };

  return (
    <View className="space-y-4 mb-4">
      <View className="space-y-4">
        <View className="flex flex-row items-center gap-2 mb-2">
          <Text className="text-primary dark:text-white font-bold text-base">
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
              'Indiquez la rémunération minimale que doit proposer la mission courte pour être affichée.',
            ]}
          />
        </View>

        <View className="space-y-3 mb-4">
          <LabeledIconInput
            iconName="money-check-alt"
            value={filters.remuneration}
            onChangeText={changeRemuneration}
            keyboardType="numeric"
            iconSize={20}
            iconColor={isDark ? colors.primary[200] : colors.primary[400]}
            suffix="€ / h"
          />
        </View>
      </View>
      <View />
      <View className="space-y-4">
        <View className="flex flex-row items-center gap-2 mb-2">
          <Text className="text-primary dark:text-white font-bold text-base">
            Durée minimum de la mission
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
              'Indiquez la durée minimale que doit proposer la mission courte pour être affichée (en heure).',
            ]}
          />
        </View>
        <SliderIconInline
          value={filters.missionDuration}
          valueMin={0}
          valueMax={10}
          unit="h"
          sliderStyle={{
            maximumTrackTintColor: isDark ? colors.primary[500] : colors.primary[100],
          }}
          icon={
            <FontAwesome5
              name="clock"
              size={20}
              color={isDark ? colors.primary[200] : colors.primary[400]}
            />
          }
          onValueChange={changeMinimumTime}
        />
      </View>
    </View>
  );
}
