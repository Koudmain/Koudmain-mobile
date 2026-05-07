import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/constants/theme';

export const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useTheme();
  const isDark = colorMode === 'dark';

  const TOGGLE_WIDTH = 72;
  const TOGGLE_HEIGHT = 36;
  const HANDLE_SIZE = 28;
  const SPACING = 4;

  const slideDistance = TOGGLE_WIDTH - HANDLE_SIZE - SPACING * 2;

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(isDark ? slideDistance : 0, { damping: 30, stiffness: 120 }) },
      ],
    };
  });

  return (
    <Pressable onPress={toggleColorMode}>
      <View
        style={{ width: TOGGLE_WIDTH, height: TOGGLE_HEIGHT }}
        className="rounded-full justify-center px-1 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
      >
        <Animated.View
          style={[{ width: HANDLE_SIZE, height: HANDLE_SIZE }, animatedHandleStyle]}
          className="rounded-full bg-white dark:bg-zinc-200 shadow-sm items-center justify-center"
        >
          <Feather
            name={isDark ? 'moon' : 'sun'}
            size={18}
            color={isDark ? colors?.assets.moon : colors?.assets.sun}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};
