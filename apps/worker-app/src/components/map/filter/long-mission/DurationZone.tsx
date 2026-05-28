import InfoHint from '@/components/ui/InfoHint';
import DurationSelectorInput from '@/components/utils/DurationSelectorInput';
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

  const computeActive = (
    nextMinimumUnit: DurationUnit,
    nextMaximumUnit: DurationUnit,
    nextMinimumDuration: string,
    nextMaximumDuration: string,
  ) => {
    return [
      nextMinimumUnit !== defaultFDurationLongMissionFilter.minimumUnit ||
        nextMinimumDuration !== defaultFDurationLongMissionFilter.minimumDuration,
      nextMaximumUnit !== defaultFDurationLongMissionFilter.maximumUnit ||
        nextMaximumDuration !== defaultFDurationLongMissionFilter.maximumDuration,
    ].filter(Boolean).length;
  };

  const handleMinimumUnitChange = (unit: DurationUnit) => {
    const nextFilters = { ...filters, minimumUnit: unit };
    const active =
      computeActive(
        unit,
        nextFilters.maximumUnit,
        nextFilters.minimumDuration,
        nextFilters.maximumDuration,
      ) > 0;

    setFilters({
      ...nextFilters,
      active,
    });
  };

  const handleMaximumUnitChange = (unit: DurationUnit) => {
    const nextFilters = { ...filters, maximumUnit: unit };
    const active =
      computeActive(
        nextFilters.minimumUnit,
        unit,
        nextFilters.minimumDuration,
        nextFilters.maximumDuration,
      ) > 0;

    setFilters({
      ...nextFilters,
      active,
    });
  };

  const handleMinimumDurationChange = (duration: string) => {
    const nextFilters = { ...filters, minimumDuration: duration };
    const active =
      computeActive(
        nextFilters.minimumUnit,
        nextFilters.maximumUnit,
        duration,
        nextFilters.maximumDuration,
      ) > 0;

    setFilters({
      ...nextFilters,
      active,
    });
  };

  const handleMaximumDurationChange = (duration: string) => {
    const nextFilters = { ...filters, maximumDuration: duration };
    const active =
      computeActive(
        nextFilters.minimumUnit,
        nextFilters.maximumUnit,
        nextFilters.minimumDuration,
        duration,
      ) > 0;

    setFilters({
      ...nextFilters,
      active,
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

  const handleMinimumChange = (text: string) => {
    const normalizedValue = normalizeDuration(text, filters.minimumUnit);

    handleMinimumDurationChange(normalizedValue);

    if (normalizedValue === '') {
      return;
    }

    const minimumValue = Number.parseInt(normalizedValue, 10);

    if (filters.minimumUnit === filters.maximumUnit) {
      const maximumValue =
        filters.maximumDuration === ''
          ? minimumValue
          : Number.parseInt(filters.maximumDuration, 10);

      if (Number.isNaN(maximumValue) || maximumValue < minimumValue) {
        handleMaximumDurationChange(String(minimumValue));
      }
    }
  };

  const handleMaximumChange = (text: string) => {
    const normalizedValue = normalizeDuration(text, filters.maximumUnit);

    if (normalizedValue === '') {
      handleMaximumDurationChange('');
      return;
    }

    const maximumValue = Number.parseInt(normalizedValue, 10);
    const minimumValue =
      filters.minimumDuration === '' ? 0 : Number.parseInt(filters.minimumDuration, 10);

    if (filters.minimumUnit === filters.maximumUnit) {
      handleMaximumDurationChange(String(Math.max(maximumValue, minimumValue)));
      return;
    }

    handleMaximumDurationChange(String(maximumValue));
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
        onChangeValue={handleMinimumChange}
        placeholderColor={isDark ? colors.primary[200] : colors.primary[400]}
        placeholder="0"
        title="Minimum"
        subtitle={`Limite: ${getDurationLimit(filters.minimumUnit)} ${getUnitLabel(filters.minimumUnit)} max`}
        selectedValue={filters.minimumUnit}
        onChangeSelectedValue={(value) => handleMinimumUnitChange(value as DurationUnit)}
      />

      <DurationSelectorInput
        options={durationOptions}
        initialValue={filters.maximumDuration}
        value={filters.maximumDuration}
        onChangeValue={handleMaximumChange}
        placeholderColor={isDark ? colors.primary[200] : colors.primary[400]}
        placeholder="0"
        title="Maximum"
        subtitle={`Limite: ${getDurationLimit(filters.maximumUnit)} ${getUnitLabel(filters.maximumUnit)} max`}
        selectedValue={filters.maximumUnit}
        onChangeSelectedValue={(value) => handleMaximumUnitChange(value as DurationUnit)}
        className="mt-4"
      />
    </View>
  );
}
