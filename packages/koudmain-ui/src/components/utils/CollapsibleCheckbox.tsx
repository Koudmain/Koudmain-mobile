import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface CollapsibleCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Un composant qui affiche une case à cocher collapsible
 * @param label Le libellé de la case à cocher
 * @param checked L'état de la case à cocher (cochée ou non)
 * @param onChange La fonction à appeler lorsque l'état de la case à cocher change
 * @param className Classes supplémentaires pour le conteneur principal
 * @param children Les enfants à afficher lorsque la case est cochée
 * @returns Un composant CollapsibleCheckbox
 */
export const CollapsibleCheckbox = ({
  label,
  checked,
  onChange,
  className = '',
  children,
}: CollapsibleCheckboxProps) => {
  return (
    <View className={`mb-4 ${className}`}>
      <Pressable onPress={() => onChange(!checked)} className="flex-row items-center py-2">
        <View
          className={`w-5 h-5 mr-3 rounded justify-center items-center border ${
            checked ? 'bg-secondary border-secondary' : 'border-gray-600 bg-transparent'
          }`}
        >
          {checked && <Text className="text-white text-xs font-bold">✓</Text>}
        </View>

        <Text className="text-primary dark:text-white text-lg">{label}</Text>
      </Pressable>

      {checked && <View className="mt-2 animate-fade-in">{children}</View>}
    </View>
  );
};
