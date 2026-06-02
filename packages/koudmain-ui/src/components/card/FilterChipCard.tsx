import React from 'react';
import { SvgProps } from 'react-native-svg';
import { TouchableOpacity, Text, View, useColorScheme } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { colors } from '../../constants/theme';

interface FilterChipProps {
  label: string;
  IconLibrary?: any;
  iconName?: string;
  SvgComponent?: React.FC<SvgProps>;
  isActive: boolean;
  onPress: () => void;
}

const FilterChip = ({
  label,
  IconLibrary,
  iconName,
  SvgComponent,
  isActive,
  onPress,
}: FilterChipProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const borderColor = isActive
    ? 'border-secondary-500'
    : isDark
      ? 'border-primary-content'
      : 'border-primary';
  const bgColor = isActive ? 'bg-secondary-50' : 'bg-transparent';
  const textColor = isActive ? 'text-primary' : 'text-primary-disabled';

  const activeIconColor = colors.secondary.DEFAULT;
  const inactiveIconColor = isDark ? colors.primary.content : colors.primary.DEFAULT;
  const currentColor = isActive ? activeIconColor : inactiveIconColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-2 mr-2 rounded-full border ${borderColor} ${bgColor}`}
    >
      <View className="mr-2">
        {SvgComponent ? (
          <SvgComponent width={20} height={20} fill={currentColor} />
        ) : IconLibrary && iconName ? (
          <IconLibrary name={iconName} size={20} color={currentColor} />
        ) : null}
      </View>

      <Text className={`text-base font-medium ${textColor}`}>{label}</Text>

      {isActive && (
        <View className="ml-1">
          <Entypo name="cross" size={18} color={colors.primary.disabled} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FilterChip;
