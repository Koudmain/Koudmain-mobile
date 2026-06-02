import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface DynamicMarkerProps extends SvgProps {
  multiple?: boolean;
  color?: string;
  isSelected?: boolean;
}

export function DynamicMarker({
  multiple = false,
  color,
  isSelected,
  ...props
}: DynamicMarkerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const mainColor = isSelected
    ? colors.map.selected
    : (color ?? (isDark ? colors?.primary.content : colors?.primary.DEFAULT));

  // 1. Le Pin Central
  const centerPin = 'M12,2c3.9,0,7,3.1,7,7c0,5.2-7,13-7,13S5,14.2,5,9C5,5.1,8.1,2,12,2';

  // 2. Le Rond Central
  const centerCircle =
    'M12,11.5c1.4,0,2.5-1.1,2.5-2.5S13.4,6.5,12,6.5S9.5,7.6,9.5,9S10.6,11.5,12,11.5';

  // 3. Les deux branches sur le côté
  const sideBranches =
    'M3,9c0,4.5,5.1,10.7,6,11.8L8,22c0,0-7-7.8-7-13c0-3.2,2.1-5.8,5-6.7C4.2,3.9,3,6.3,3,9z M18,2.3 c2.9,0.9,5,3.5,5,6.7c0,5.2-7,13-7,13l-1-1.2c0.9-1.1,6-7.3,6-11.8C21,6.3,19.8,3.9,18,2.3z';

  return (
    <Svg
      width={props.width ?? 40}
      height={props.height ?? 40}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {multiple && <Path d={sideBranches} fill={mainColor} opacity={0.6} />}

      <Path d={centerPin} fill={mainColor} />

      <Path d={centerCircle} fill={isDark ? colors.primary.DEFAULT : colors.primary.content} />
    </Svg>
  );
}
