import { useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export type DurationSelectorOption = {
  label: string;
  value: string;
};

interface DurationSelectorInputProps {
  options: DurationSelectorOption[];
  initialValue?: string;
  value?: string;
  onChangeValue: (value: string) => void;
  placeholderColor: string;
  placeholder: string;
  title: string;
  subtitle: string;
  className?: string;
  selectedValue?: string;
  onChangeSelectedValue?: (value: string) => void;
}

/**
 *
 * @param options Les différentes options d'unité de durée (ex: jours, mois)
 * @param initialValue La valeur initiale du champ de saisie de la durée (ex: "2")
 * @param value La valeur contrôlée du champ de saisie de la durée (ex: "2")
 * @param onChangeValue Fonction appelée lors du changement de la valeur du champ de saisie de la durée, reçoit la nouvelle valeur en argument
 * @param placeholderColor La couleur du texte d'espace réservé dans le champ de saisie
 * @param placeholder Le texte d'espace réservé à afficher dans le champ de saisie lorsque celui-ci est vide
 * @param title Le titre à afficher au-dessus du sélecteur de durée
 * @param subtitle Le sous-titre à afficher sous le titre, généralement pour fournir des informations supplémentaires
 * @param className Classes supplémentaires pour le conteneur principal du composant
 * @param selectedValue La valeur contrôlée de l'option d'unité sélectionnée (ex: "days" ou "months")
 * @param onChangeSelectedValue Fonction appelée lors du changement de l'option d'unité sélectionnée, reçoit la nouvelle valeur en argument
 * @returns
 */
export default function DurationSelectorInput({
  options,
  initialValue = '',
  value,
  onChangeValue,
  placeholderColor,
  placeholder,
  title,
  subtitle,
  className = '',
  selectedValue,
  onChangeSelectedValue,
}: DurationSelectorInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [internalValue, setInternalValue] = useState(initialValue);
  const [internalSelectedValue, setInternalSelectedValue] = useState(options[0]?.value ?? '');
  const [isOpen, setIsOpen] = useState(false);

  const currentValue = selectedValue ?? internalSelectedValue;
  const currentInputValue = value ?? internalValue;
  const currentOption = useMemo(
    () => options.find((option) => option.value === currentValue) ?? options[0],
    [currentValue, options],
  );

  const handleValueChange = (value: string) => {
    setInternalValue(value);
    onChangeValue(value);
  };

  const handleOptionChange = (value: string) => {
    if (onChangeSelectedValue) {
      onChangeSelectedValue(value);
    } else {
      setInternalSelectedValue(value);
    }

    setIsOpen(false);
  };

  const updateValue = (nextValue: string) => {
    setInternalValue(nextValue);
    onChangeValue(nextValue);
  };

  const handleIncrement = () => {
    const currentNumericValue = Number.parseInt(currentInputValue || '0', 10);

    if (Number.isNaN(currentNumericValue)) {
      updateValue('1');
      return;
    }

    updateValue(String(currentNumericValue + 1));
  };

  const handleDecrement = () => {
    const currentNumericValue = Number.parseInt(currentInputValue || '0', 10);

    if (Number.isNaN(currentNumericValue) || currentNumericValue <= 0) {
      updateValue('0');
      return;
    }

    updateValue(String(currentNumericValue - 1));
  };

  return (
    <View className={['space-y-2', className].filter(Boolean).join(' ')}>
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-sm font-semibold text-primary dark:text-white">{title}</Text>
      </View>

      {subtitle ? (
        <Text className="text-xs text-gray-400 dark:text-gray-300">{subtitle}</Text>
      ) : null}

      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 flex-row items-center justify-between rounded-xl border border-gray-100 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-primary-700">
          <TouchableOpacity
            onPress={handleDecrement}
            className="h-9 w-9 items-center justify-center rounded-full bg-secondary"
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Diminuer la valeur"
          >
            <FontAwesome5
              name="minus"
              size={11}
              color={isDark ? colors.primary[200] : colors.primary.content}
            />
          </TouchableOpacity>

          <TextInput
            value={currentInputValue}
            onChangeText={handleValueChange}
            keyboardType="number-pad"
            className="mx-2 flex-1 text-center text-primary dark:text-white"
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
          />

          <TouchableOpacity
            onPress={handleIncrement}
            className="h-9 w-9 items-center justify-center rounded-full bg-secondary"
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Augmenter la valeur"
          >
            <FontAwesome5
              name="plus"
              size={11}
              color={isDark ? colors.primary[200] : colors.primary.content}
            />
          </TouchableOpacity>
        </View>

        <View className="relative w-28">
          <TouchableOpacity
            onPress={() => setIsOpen((value) => !value)}
            className="flex-row items-center justify-between rounded-xl bg-gray-100 px-3 py-2 dark:bg-primary-700"
            activeOpacity={0.8}
          >
            <Text className="font-semibold text-primary dark:text-white">
              {currentOption?.label ?? 'Choisir'}
            </Text>
            <FontAwesome5
              name="chevron-down"
              size={12}
              color={isDark ? colors.primary[200] : colors.primary[400]}
            />
          </TouchableOpacity>

          {isOpen ? (
            <View className="absolute right-0 top-[52px] z-20 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-primary-700">
              {options.map((option) => {
                const isSelected = currentValue === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleOptionChange(option.value)}
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
      </View>
    </View>
  );
}
