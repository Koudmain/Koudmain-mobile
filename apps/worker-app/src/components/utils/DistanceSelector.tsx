import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '@/constants/theme';
import { cnFusion } from '@/utils/cnFusion';

interface DistanceSelectorProps {
  distance: number;
  onValuesChange: (dist: number) => void;
  className?: string;
}

export default function DistanceSelector({
  distance,
  onValuesChange,
  className,
}: DistanceSelectorProps) {
  const [value, setValue] = useState<string>(distance.toString());

  const handleDistChange = (text: string) => {
    setValue(text);
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      onValuesChange(num);
    }
  };

  useEffect(() => {
    setValue(distance.toString());
  }, [distance]);

  return (
    <View className={cnFusion('space-y-4 p-1', className)}>
      <View className="flex-row items-center">
        <Text className="text-sm pr-20 font-semibold text-primary dark:text-white">
          Distance de recherche
        </Text>
        <View className="flex-1 flex-row items-center">
          <View className="flex-1">
            <TextInput
              keyboardType="number-pad"
              value={value}
              onChangeText={handleDistChange}
              className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-center font-medium text-gray-800"
            />
          </View>
          <Text className="text-sm pl-4 text-primary">km</Text>
        </View>
      </View>

      <View className="pt-2">
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={parseInt(value, 10) || 0}
          onValueChange={(value) => handleDistChange(value.toString())}
          minimumTrackTintColor={colors.secondary.DEFAULT}
          maximumTrackTintColor={colors.neutral[200]}
          thumbTintColor={colors.secondary.DEFAULT}
        />
        <View className="flex-row justify-between px-1">
          <Text className="text-xs text-gray-400">0 km</Text>
          <Text className="text-xs text-gray-400">100 km</Text>
        </View>
      </View>
    </View>
  );
}
