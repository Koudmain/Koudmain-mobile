import { useState } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import LabeledIconInput from '@/components/form/LabeledIconInput';
import InfoHint from '@/components/ui/InfoHint';
import SliderIconInline from '@/components/utils/SliderIconInline';

export default function ShortMissionFilter() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [remuneration, setRemuneration] = useState('0.00');
  const [missionDuration, setMissionDuration] = useState(0);

  const changeRemuneration = (text: string) => {
    const numericValue = text.replace(/[^0-9.,]/g, '').replace(',', '.');

    if (numericValue === '') {
      setRemuneration('');
      return;
    }

    const parsedValue = Number.parseFloat(numericValue);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    setRemuneration(String(parsedValue));
  };

  const changeMinimumTime = (time: number) => {
    setMissionDuration(time);
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
            value={remuneration}
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
              'Indiquez la durée minimale que doit proposer la mission courte pour être affichée. (en heure',
            ]}
          />
        </View>
        <SliderIconInline
          value={missionDuration}
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
