import { Text, useColorScheme, View } from 'react-native';
import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import LabeledIconInput from '@/components/form/LabeledIconInput';
import InfoHint from '@/components/ui/InfoHint';
import DurationSelectorInput, {
  DurationSelectorOption,
} from '@/components/utils/DurationSelectorInput';

type DurationUnit = 'days' | 'months';

const durationOptions: DurationSelectorOption[] = [
  { label: 'jours', value: 'days' },
  { label: 'mois', value: 'months' },
];

export default function LongMissionFilter() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [minimumUnit, setMinimumUnit] = useState<DurationUnit>('days');
  const [maximumUnit, setMaximumUnit] = useState<DurationUnit>('months');
  const [minimumDuration, setMinimumDuration] = useState('2');
  const [maximumDuration, setMaximumDuration] = useState('3');

  const getDurationLimit = (unit: DurationUnit) => (unit === 'days' ? 30 : 18);

  const getUnitLabel = (unit: DurationUnit) => (unit === 'days' ? 'jours' : 'mois');

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
    const normalizedValue = normalizeDuration(text, minimumUnit);

    setMinimumDuration(normalizedValue);

    if (normalizedValue === '') {
      return;
    }

    const minimumValue = Number.parseInt(normalizedValue, 10);

    if (minimumUnit === maximumUnit) {
      const maximumValue =
        maximumDuration === '' ? minimumValue : Number.parseInt(maximumDuration, 10);

      if (Number.isNaN(maximumValue) || maximumValue < minimumValue) {
        setMaximumDuration(String(minimumValue));
      }
    }
  };

  const handleMaximumChange = (text: string) => {
    const normalizedValue = normalizeDuration(text, maximumUnit);

    if (normalizedValue === '') {
      setMaximumDuration('');
      return;
    }

    const maximumValue = Number.parseInt(normalizedValue, 10);
    const minimumValue = minimumDuration === '' ? 0 : Number.parseInt(minimumDuration, 10);

    if (minimumUnit === maximumUnit) {
      setMaximumDuration(String(Math.max(maximumValue, minimumValue)));
      return;
    }

    setMaximumDuration(String(maximumValue));
  };

  return (
    <View className="space-y-4 pb-32">
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
          value="13.00"
          onChangeText={() => undefined}
          keyboardType="numeric"
          iconSize={20}
          iconColor={isDark ? colors.primary[200] : colors.primary[400]}
          suffix="€ / h"
        />

        <LabeledIconInput
          iconName="money-check-alt"
          label="Salaire mensuel minimum"
          value="1750.00"
          onChangeText={() => undefined}
          keyboardType="numeric"
          iconSize={20}
          iconColor={isDark ? colors.primary[200] : colors.primary[400]}
          suffix="€ / mois"
        />
      </View>

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
          initialValue={minimumDuration}
          value={minimumDuration}
          onChangeValue={handleMinimumChange}
          placeholderColor={isDark ? colors.primary[200] : colors.primary[400]}
          placeholder="0"
          title="Minimum"
          subtitle={`Limite: ${getDurationLimit(minimumUnit)} ${getUnitLabel(minimumUnit)} max`}
          selectedValue={minimumUnit}
          onChangeSelectedValue={(value) => setMinimumUnit(value as DurationUnit)}
        />

        <DurationSelectorInput
          options={durationOptions}
          initialValue={maximumDuration}
          value={maximumDuration}
          onChangeValue={handleMaximumChange}
          placeholderColor={isDark ? colors.primary[200] : colors.primary[400]}
          placeholder="0"
          title="Maximum"
          subtitle={`Limite: ${getDurationLimit(maximumUnit)} ${getUnitLabel(maximumUnit)} max`}
          selectedValue={maximumUnit}
          onChangeSelectedValue={(value) => setMaximumUnit(value as DurationUnit)}
          className="mt-4"
        />
      </View>
    </View>
  );
}
