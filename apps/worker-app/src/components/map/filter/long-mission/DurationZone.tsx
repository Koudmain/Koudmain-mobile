import InfoHint from '@koudmain/ui/components/utils/InfoHint';
import DurationSelectorInput from '@koudmain/ui/components/utils/DurationSelectorInput';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { View, Text, useColorScheme } from 'react-native';
import { durationOptions, getDurationLimit, getUnitLabel, DurationUnit } from '../FilterProps';

export interface FDurationLongMissionFilter {
  minimumUnit: DurationUnit;
  maximumUnit: DurationUnit;
  minimumDuration: string;
  maximumDuration: string;
  active: boolean;
}
export const defaultFDurationLongMissionFilter: FDurationLongMissionFilter = {
  minimumUnit: 'days',
  maximumUnit: 'months',
  minimumDuration: '2',
  maximumDuration: '18',
  active: false,
};

interface DurationZoneProps {
  filters: FDurationLongMissionFilter;
  setFilters: (filters: FDurationLongMissionFilter) => void;
}

export default function DurationZone({ filters, setFilters }: DurationZoneProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const computeActive = (nextFilters: FDurationLongMissionFilter) => {
    return [
      nextFilters.minimumUnit !== defaultFDurationLongMissionFilter.minimumUnit ||
        nextFilters.minimumDuration !== defaultFDurationLongMissionFilter.minimumDuration,
      nextFilters.maximumUnit !== defaultFDurationLongMissionFilter.maximumUnit ||
        nextFilters.maximumDuration !== defaultFDurationLongMissionFilter.maximumDuration,
    ].filter(Boolean).length;
  };

  const updateFilters = (patch: Partial<FDurationLongMissionFilter>) => {
    const nextFilters = { ...filters, ...patch };

    setFilters({
      ...nextFilters,
      active: computeActive(nextFilters) > 0,
    });
  };

  const normalizeDuration = (text: string, unit: DurationUnit) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      return '';
    }

    const parsedValue = Number.parseInt(numericValue, 10);

    if (Number.isNaN(parsedValue)) {
      return '';
    }

    return String(Math.min(parsedValue, getDurationLimit(unit)));
  };

  const handleDurationChange = (field: 'minimum' | 'maximum', text: string) => {
    const isMinimum = field === 'minimum';
    const unit = isMinimum ? filters.minimumUnit : filters.maximumUnit;
    const normalizedValue = normalizeDuration(text, unit);

    updateFilters({
      [isMinimum ? 'minimumDuration' : 'maximumDuration']: normalizedValue,
    } as Partial<FDurationLongMissionFilter>);

    if (normalizedValue === '') {
      return;
    }

    const currentValue = Number.parseInt(normalizedValue, 10);

    if (isMinimum) {
      if (filters.minimumUnit === filters.maximumUnit) {
        const maximumValue =
          filters.maximumDuration === ''
            ? currentValue
            : Number.parseInt(filters.maximumDuration, 10);

        if (Number.isNaN(maximumValue) || maximumValue < currentValue) {
          updateFilters({ maximumDuration: String(currentValue) });
        }
      }
      return;
    }

    if (filters.minimumUnit === filters.maximumUnit) {
      const minimumValue =
        filters.minimumDuration === '' ? 0 : Number.parseInt(filters.minimumDuration, 10);

      updateFilters({ maximumDuration: String(Math.max(currentValue, minimumValue)) });
      return;
    }

    updateFilters({ maximumDuration: String(currentValue) });
  };

  return (
    <View className="space-y-3">
      <View className="flex flex-row items-center gap-2 mb-2">
        <Text className="text-primary dark:text-white font-bold text-base">
          Durée de la mission
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
            'Indiquez le temps minimum et maximum que doit durer la mission pour être affichée.',
            "Vous pouvez choisir d'exprimer ces durées en jours ou en mois.",
          ]}
        />
      </View>

      <DurationSelectorInput
        options={durationOptions}
        initialValue={filters.minimumDuration}
        value={filters.minimumDuration}
        onChangeValue={(text) => handleDurationChange('minimum', text)}
        placeholderColor={isDark ? colors.primary[200] : colors.primary[400]}
        placeholder="0"
        title="Minimum"
        subtitle={`Limite: ${getDurationLimit(filters.minimumUnit)} ${getUnitLabel(filters.minimumUnit)} max`}
        selectedValue={filters.minimumUnit}
        onChangeSelectedValue={(value) => updateFilters({ minimumUnit: value as DurationUnit })}
      />

      <DurationSelectorInput
        options={durationOptions}
        initialValue={filters.maximumDuration}
        value={filters.maximumDuration}
        onChangeValue={(text) => handleDurationChange('maximum', text)}
        placeholderColor={isDark ? colors.primary[200] : colors.primary[400]}
        placeholder="0"
        title="Maximum"
        subtitle={`Limite: ${getDurationLimit(filters.maximumUnit)} ${getUnitLabel(filters.maximumUnit)} max`}
        selectedValue={filters.maximumUnit}
        onChangeSelectedValue={(value) => updateFilters({ maximumUnit: value as DurationUnit })}
        className="mt-4"
      />
    </View>
  );
}
