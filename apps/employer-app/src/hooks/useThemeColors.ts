import { useColorScheme } from 'react-native';
import { colors } from '@/constants/theme';

// Use that for props that only accept a raw color value and therefore no tailwind class names
export function useThemeColors() {
  const isDark = useColorScheme() === 'dark';

  return {
    isDark,
    icon: isDark ? colors.primary.content : colors.primary.DEFAULT,
    text: isDark ? colors.primary.content : colors.primary.DEFAULT,
    mutedText: isDark ? colors.primary.disabled : colors.primary.hover,
    track: isDark ? colors.primary.disabled : colors.primary.DEFAULT,
  };
}
