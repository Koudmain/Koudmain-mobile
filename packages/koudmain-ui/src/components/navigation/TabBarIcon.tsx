import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import React from 'react';
import { colors } from '@/constants/theme';

export const ICON_DIMENSIONS = {
  small: {
    container: 'size-12',
    icon: 24,
  },
  large: {
    container: 'size-16',
    icon: 36,
  },
};

interface TabBarIconProps {
  IconLibrary?: any;
  iconName?: string;
  SvgComponent?: React.ComponentType<SvgProps & { color?: string }>;
  color: string;
  isLarge?: boolean;
}

export function TabBarIcon({
  IconLibrary,
  iconName,
  SvgComponent,
  color,
  isLarge,
}: TabBarIconProps) {
  const isActive = color === colors?.secondary.DEFAULT;
  const dimensions = isLarge ? ICON_DIMENSIONS.large : ICON_DIMENSIONS.small;

  return (
    <View
      className={`bg-white dark:bg-primary justify-center items-center
        ${dimensions.container} rounded-full
        shadow-md ${isLarge && isActive ? 'shadow-secondary/60' : 'shadow-primary/60 dark:shadow-white/20'}
        border-0 ${isLarge && isActive ? 'border-secondary/20' : 'border-primary/20 dark:shadow-white/10'}`}
    >
      {SvgComponent ? (
        <SvgComponent width={dimensions.icon} height={dimensions.icon} color={color} />
      ) : IconLibrary && iconName ? (
        <IconLibrary name={iconName} size={dimensions.icon} color={color} />
      ) : null}
    </View>
  );
}
