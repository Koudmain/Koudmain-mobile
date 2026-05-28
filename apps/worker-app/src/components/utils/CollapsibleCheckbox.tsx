import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface CollapsibleCheckboxProps {
  label: string;
  initialValue?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CollapsibleCheckbox = ({
  label,
  initialValue = false,
  className = '',
  children,
}: CollapsibleCheckboxProps) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  return (
    <View className={`mb-4 ${className}`}>
      <Pressable onPress={() => setIsChecked(!isChecked)} className="flex-row items-center py-2">
        <View
          className={`w-5 h-5 mr-3 rounded justify-center items-center border ${
            isChecked ? 'bg-secondary border-secondary' : 'border-gray-600 bg-transparent'
          }`}
        >
          {isChecked && <Text className="text-white text-xs font-bold">✓</Text>}
        </View>

        <Text className="text-primary dark:text-white text-lg">{label}</Text>
      </Pressable>

      {isChecked && <View className="pl-8 mt-2 animate-fade-in">{children}</View>}
    </View>
  );
};
