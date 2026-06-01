import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/text';
import { colors } from 'src/constants/theme';

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
