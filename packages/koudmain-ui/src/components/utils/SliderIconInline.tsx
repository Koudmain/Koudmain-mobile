import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../../constants/theme';
import { cnFusion } from '../../utils/cnFusion';

interface SliderIconInlineProps {
  title?: string;
  value: number;
  valueMin?: number;
  valueMax?: number;
  unit?: string;
  sliderStyle?: {
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
  };
  icon: React.ReactNode;
  onValueChange: (value: number) => void;
  className?: string;
}

/**
 *
 * @param title Titre à afficher au-dessus du slider
 * @param value La valeur actuellement sélectionnée
 * @param valueMin La valeur minimale sélectionnable (par défaut: 0)
 * @param valueMax La valeur maximale sélectionnable (par défaut: 10)
 * @param unit L'unité à afficher à côté du champ de saisie (par défaut: 'h')
 * @param sliderStyle Styles personnalisés pour le slider, permettant de configurer les couleurs de la piste et du thumb
 * @param icon L'icône à afficher à gauche du champ de saisie
 * @param onValueChange Fonction appelée lorsque la valeur change, reçoit la nouvelle valeur en paramètre
 * @param className Classes supplémentaires pour le conteneur principal du composant
 * @returns Un composant SliderIconInline qui affiche un champ de saisie pour la valeur et un slider pour la sélectionner visuellement, avec des limites configurables, une unité affichée, et une icône à gauche du champ de saisie. Le slider et le champ de saisie sont synchronisés pour refléter la même valeur.
 */
export default function SliderIconInline({
  title,
  value,
  valueMin = 0,
  valueMax = 10,
  unit = 'h',
  icon,
  onValueChange,
  className,
  sliderStyle,
}: SliderIconInlineProps) {
  const [valueLocal, setValueLocal] = useState<number>(value);

  const handleValueChange = (val: number) => {
    setValueLocal(val);
    if (val > valueMax) {
      onValueChange(valueMax);
      setValueLocal(valueMax);
      return;
    }
    if (!isNaN(val)) {
      onValueChange(val);
    }
  };

  useEffect(() => {
    setValueLocal(value);
  }, [value]);

  return (
    <View className={cnFusion('space-y-4 p-1', className)}>
      <View className="flex-row items-center">
        {title && (
          <Text className="text-sm pr-20 font-semibold text-primary dark:text-white">{title}</Text>
        )}
      </View>

      <View className="flex flex-row items-center gap-3">
        {icon}
        <View className="flex flex-row items-center">
          <View className="flex w-16">
            <TextInput
              keyboardType="number-pad"
              value={valueLocal.toString()}
              onChangeText={(text) => handleValueChange(parseFloat(text) || 0)}
              className="border border-primary-300 dark:border-primary-500 rounded-xl p-3 bg-gray-50 dark:bg-primary-500 text-center font-medium text-primary dark:text-white"
            />
          </View>
          <Text className="text-sm pl-4 text-primary">{unit}</Text>
        </View>
        <View className="flex flex-1 flex-col pt-2">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={valueMin}
            maximumValue={valueMax}
            step={1}
            value={valueLocal || 0}
            onValueChange={(value) => handleValueChange(value)}
            minimumTrackTintColor={sliderStyle?.minimumTrackTintColor || colors.secondary.DEFAULT}
            maximumTrackTintColor={sliderStyle?.maximumTrackTintColor || colors.neutral[200]}
            thumbTintColor={sliderStyle?.thumbTintColor || colors.secondary.DEFAULT}
          />
          <View className="flex-row justify-between px-1">
            <Text className="text-xs text-gray-400">
              {valueMin} {unit}
            </Text>
            <Text className="text-xs text-gray-400">
              {valueMax} {unit}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
