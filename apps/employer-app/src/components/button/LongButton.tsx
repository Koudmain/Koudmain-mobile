import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@koudmain/ui/gluestack';

interface CustomButtonProps {
  label: string;
  onPress?: () => void;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-5 bg-secondary items-center justify-center py-4 px-4 rounded-full overflow-hidden"
    >
      <Text className="text-white text-base font-semibold">{label}</Text>
    </TouchableOpacity>
  );
};
