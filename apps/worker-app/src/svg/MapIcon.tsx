import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface TwoToneMapIconProps extends SvgProps {
  mapStrokeColor?: string;
  pinStrokeColor?: string;
}

export function MapIcon({ mapStrokeColor, pinStrokeColor, ...props }: TwoToneMapIconProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const finalMapColor =
    mapStrokeColor ?? (isDark ? colors?.primary.content : colors?.primary.DEFAULT);

  const finalPinColor = pinStrokeColor ?? colors?.secondary.DEFAULT;

  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {/* --- Le fond de carte --- */}
      <Path
        d="M9 20L3 17V4L5 5M9 20L15 17M9 20V14M15 17L21 20V7L19 6M15 17V14"
        stroke={finalMapColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* --- Le Pin (Marqueur) --- */}
      <Path
        d="M12 6H12.01 M15 6.2C15 7.96731 13.5 9.4 12 11C10.5 9.4 9 7.96731 9 6.2C9 4.43269 10.3431 3 12 3C13.6569 3 15 4.43269 15 6.2Z"
        stroke={finalPinColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
