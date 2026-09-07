import React from 'react';
import { SvgProps } from 'react-native-svg';
import { TouchableOpacity, Text, View, useColorScheme } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { colors } from '../../constants/theme';

interface FilterChipProps {
  label: string;
  iconLibrary?: React.ElementType;
  iconName?: string;
  svgComponent?: React.FC<SvgProps>;
  isActive: boolean;
  onPress: () => void;
}

const FilterChip = ({
  label,
  iconLibrary,
  iconName,
  svgComponent,
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
        {svgComponent
          ? React.createElement(svgComponent, { width: 20, height: 20, fill: currentColor })
          : iconLibrary && iconName
            ? React.createElement(iconLibrary, { name: iconName, size: 20, color: currentColor })
            : null}
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
