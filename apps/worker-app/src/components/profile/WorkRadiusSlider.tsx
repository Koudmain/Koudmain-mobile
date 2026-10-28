import { Text, View, useColorScheme } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '@/constants/theme';

interface WorkRadiusSliderProps {
  radius: number;
  onChange: (radius: number) => void;
}

export function WorkRadiusSlider({ radius, onChange }: WorkRadiusSliderProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View>
      <View className="flex-row items-center justify-between mt-4">
        <Text className="text-primary dark:text-white font-semibold">Rayon de déplacement :</Text>
        <Text className="text-secondary-500 font-bold">{radius} km</Text>
      </View>

      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={1}
        maximumValue={50}
        step={1}
        value={radius}
        onValueChange={onChange}
        minimumTrackTintColor={colors.secondary.DEFAULT}
        maximumTrackTintColor={isDark ? colors.primary[600] : colors.neutral[200]}
        thumbTintColor={colors.secondary.DEFAULT}
      />

      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-primary dark:text-white font-semibold">1 km</Text>
        <Text className="text-primary dark:text-white font-semibold">25 km</Text>
        <Text className="text-primary dark:text-white font-semibold">50 km</Text>
      </View>
    </View>
  );
}
