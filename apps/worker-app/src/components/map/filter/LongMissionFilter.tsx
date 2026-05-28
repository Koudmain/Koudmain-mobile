import { Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import LabeledIconInput from '@/components/form/LabeledIconInput';

type DurationUnit = 'days' | 'months';

const durationOptions: { label: string; value: DurationUnit }[] = [
  { label: 'Jours', value: 'days' },
  { label: 'Mois', value: 'months' },
];

export default function LongMissionFilter() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [minimumUnit, setMinimumUnit] = useState<DurationUnit>('days');
  const [maximumUnit, setMaximumUnit] = useState<DurationUnit>('months');
  const [openSelector, setOpenSelector] = useState<'minimum' | 'maximum' | null>(null);
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

  const renderDurationSelector = (field: 'minimum' | 'maximum', unit: DurationUnit) => {
    const isOpen = openSelector === field;
    const selectedLabel = getUnitLabel(unit);

    return (
      <View className="relative w-28">
        <TouchableOpacity
          onPress={() => setOpenSelector(isOpen ? null : field)}
          className="flex-row items-center justify-between rounded-xl bg-gray-100 dark:bg-zinc-900 px-3 py-2"
          activeOpacity={0.8}
        >
          <Text className="font-semibold text-primary dark:text-white">{selectedLabel}</Text>
          <FontAwesome5
            name="chevron-down"
            size={12}
            color={isDark ? colors.primary[200] : colors.primary[400]}
          />
        </TouchableOpacity>

        {isOpen ? (
          <View className="absolute right-0 top-[52px] z-20 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {durationOptions.map((option) => {
              const isSelected = unit === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    if (field === 'minimum') {
                      setMinimumUnit(option.value);
                    } else {
                      setMaximumUnit(option.value);
                    }

                    setOpenSelector(null);
                  }}
                  className={`px-3 py-2 ${isSelected ? 'bg-secondary' : 'bg-transparent'}`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`font-medium ${isSelected ? 'text-white' : 'text-primary dark:text-white'}`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  };

  useEffect(() => {
    const minimumLimit = getDurationLimit(minimumUnit);
    const maximumLimit = getDurationLimit(maximumUnit);

    if (minimumDuration !== '') {
      const minimumValue = Number.parseInt(minimumDuration, 10);

      if (minimumValue > minimumLimit) {
        setMinimumDuration(String(minimumLimit));
      }
    }

    if (maximumDuration !== '') {
      const maximumValue = Number.parseInt(maximumDuration, 10);

      if (maximumValue > maximumLimit) {
        setMaximumDuration(String(maximumLimit));
      }
    }

    if (minimumUnit === maximumUnit && minimumDuration !== '' && maximumDuration !== '') {
      const minimumValue = Number.parseInt(minimumDuration, 10);
      const maximumValue = Number.parseInt(maximumDuration, 10);

      if (maximumValue < minimumValue) {
        setMaximumDuration(String(minimumValue));
      }
    }
  }, [maximumDuration, maximumUnit, minimumDuration, minimumUnit]);

  return (
    <View className="space-y-4 pb-32">
      <Text className="text-primary dark:text-white font-bold text-base mb-2">
        Rémunération minimum
      </Text>

      <View className="space-y-3 mb-4">
        <LabeledIconInput
          iconName="money-check-alt"
          label="Rémunération horaire minimum"
          value="13.00"
          onChangeText={() => undefined}
          keyboardType="numeric"
          iconSize={20}
          iconColor={isDark ? colors.primary[200] : colors.primary[400]}
          suffix="€ / h"
        />

        <LabeledIconInput
          iconName="money-check-alt"
          label="Rémunération mensuelle minimum"
          value="1750.00"
          onChangeText={() => undefined}
          keyboardType="numeric"
          iconSize={20}
          iconColor={isDark ? colors.primary[200] : colors.primary[400]}
          suffix="€ / mois"
        />
      </View>

      <View className="space-y-3">
        <Text className="text-primary dark:text-white font-bold text-base">
          Durée de la mission
        </Text>

        <View className="space-y-2">
          <Text className="text-sm font-semibold text-primary dark:text-white">Minimum</Text>
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 flex-row items-center justify-between bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-700">
              <TextInput
                value={minimumDuration}
                onChangeText={handleMinimumChange}
                keyboardType="number-pad"
                className="dark:text-white text-right flex-1 mr-2"
                placeholder="0"
                placeholderTextColor={isDark ? '#A1A1AA' : '#9CA3AF'}
              />
              <Text className="text-gray-400 font-bold">{getUnitLabel(minimumUnit)}</Text>
            </View>
            {renderDurationSelector('minimum', minimumUnit)}
          </View>
          <Text className="text-xs text-gray-400">
            Limite: {getDurationLimit(minimumUnit)} {getUnitLabel(minimumUnit)} max
          </Text>
        </View>

        <View className="space-y-2 mt-4">
          <Text className="text-sm font-semibold text-primary dark:text-white">Maximum</Text>
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 flex-row items-center justify-between bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-700">
              <TextInput
                value={maximumDuration}
                onChangeText={handleMaximumChange}
                keyboardType="number-pad"
                className="dark:text-white text-right flex-1 mr-2"
                placeholder="0"
                placeholderTextColor={isDark ? '#A1A1AA' : '#9CA3AF'}
              />
              <Text className="text-gray-400 font-bold">{getUnitLabel(maximumUnit)}</Text>
            </View>
            {renderDurationSelector('maximum', maximumUnit)}
          </View>
          <Text className="text-xs text-gray-400">
            Limite: {getDurationLimit(maximumUnit)} {getUnitLabel(maximumUnit)} max
          </Text>
        </View>
      </View>
    </View>
  );
}
