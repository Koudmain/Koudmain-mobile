import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '@/constants/theme';
import { cnFusion } from '@koudmain/ui/utils/cnFusion';

interface DistanceSliderProps {
  title?: string;
  distance: number;
  distanceMin?: number;
  distanceMax?: number;
  onValuesChange: (dist: number) => void;
  unit?: string;
  className?: string;
}

/**
 * Slider pour sélectionner une distance
 * @param title Titre à afficher au-dessus du slider
 * @param distance La distance actuellement sélectionnée
 * @param distanceMin La distance minimale sélectionnable (par défaut: 0)
 * @param distanceMax La distance maximale sélectionnable (par défaut: 100)
 * @param onValuesChange Fonction appelée lorsque la distance change, reçoit la nouvelle distance en paramètre
 * @param unit L'unité de distance à afficher à côté du champ de saisie (par défaut: 'km')
 * @param className Classes supplémentaires pour le conteneur principal du composant
 * @returns Un composant DistanceSlider qui affiche un champ de saisie pour la distance et un slider pour la sélectionner visuellement, avec des limites configurables et une unité affichée.
 */
export default function DistanceSlider({
  title,
  distance,
  distanceMin = 0,
  distanceMax = 100,
  unit = 'km',
  onValuesChange,
  className,
}: DistanceSliderProps) {
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
        {title && (
          <Text className="text-sm pr-20 font-semibold text-primary dark:text-white">{title}</Text>
        )}
        <View className="flex-1 flex-row items-center">
          <View className="flex-1">
            <TextInput
              keyboardType="number-pad"
              value={value}
              onChangeText={handleDistChange}
              className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-center font-medium text-gray-800"
            />
          </View>
          <Text className="text-sm pl-4 text-primary">{unit}</Text>
        </View>
      </View>

      <View className="pt-2">
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={distanceMin}
          maximumValue={distanceMax}
          step={1}
          value={parseInt(value, 10) || 0}
          onValueChange={(value) => handleDistChange(value.toString())}
          minimumTrackTintColor={colors.secondary.DEFAULT}
          maximumTrackTintColor={colors.neutral[200]}
          thumbTintColor={colors.secondary.DEFAULT}
        />
        <View className="flex-row justify-between px-1">
          <Text className="text-xs text-gray-400">
            {distanceMin} {unit}
          </Text>
          <Text className="text-xs text-gray-400">
            {distanceMax} {unit}
          </Text>
        </View>
      </View>
    </View>
  );
}
