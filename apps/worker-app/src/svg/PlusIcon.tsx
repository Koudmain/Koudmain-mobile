import React from 'react';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';
import { colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface PlusIconProps extends SvgProps {
  verticalColor?: string;
  horizontalColor?: string;
}

export function PlusIcon({ verticalColor, horizontalColor, ...props }: PlusIconProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const computedVertical =
    verticalColor ?? (isDark ? colors?.primary.content : colors?.primary.DEFAULT);
  const computedHorizontal = horizontalColor ?? colors?.secondary.DEFAULT;

  return (
    <Svg viewBox="0 0 100 100" {...props}>
      <Rect x="42.5" y="5" width="15" height="45" fill={computedVertical} />
      <Rect x="42.5" y="50" width="15" height="45" fill={computedVertical} />
      <Rect x="5" y="42.5" width="37.5" height="15" fill={computedHorizontal} />
      <Path d="M 42.5 57.5 L 57.5 42.5 L 95 42.5 L 95 57.5 Z" fill={computedHorizontal} />
    </Svg>
  );
}
