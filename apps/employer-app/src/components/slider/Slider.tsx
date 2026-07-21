import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export type DurationSliderProps = {
  duration: number;
  setDuration: (value: number) => void;
  title?: string;
  sideText?: string;
  min?: number;
  max?: number;
  step?: number;
  iconExpo?: React.ReactNode;
};

export default function DurationSlider({
  duration,
  setDuration,
  title,
  sideText,
  min = 0,
  max = 2,
  step = 0.25,
  iconExpo = <MaterialCommunityIcons name="clock" size={24} color="black" />,
}: DurationSliderProps) {
  const formatDuration = (duration: number) => {
    const totalMinutes = Math.round(duration * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${String(minutes).padStart(2, '0')}min`;
  };

  return (
    <View className="w-full">
      {title && <Text className="text-primary font-inter font-bold text-xl">{title}</Text>}
      <View className="w-full pt-3 flex-row items-center gap-2">
        {iconExpo}
        <Text className="text-primary font-inter font-bold font-size-16 min-w-20">
          {formatDuration(duration)}
        </Text>
        {sideText && (
          <Text className="text-primary font-inter font-bold font-size-16">{sideText}</Text>
        )}
        <Slider
          style={{ width: '100%', height: 60, flex: 1 }}
          minimumValue={min}
          maximumValue={max}
          minimumTrackTintColor={colors.secondary.DEFAULT}
          maximumTrackTintColor={colors.primary.DEFAULT}
          step={step}
          value={duration}
          onValueChange={(value) => setDuration(value)}
          thumbTintColor={colors.secondary.DEFAULT}
        />
      </View>
    </View>
  );
}
