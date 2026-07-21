import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../constants/theme';

const TOGGLE_WIDTH = 96;
const TOGGLE_HEIGHT = 36;
const HANDLE_SIZE = 28;
const SPACING = 4;

const positionLeft = 0;
const positionCenter = (TOGGLE_WIDTH - HANDLE_SIZE - SPACING * 2) / 2;
const positionRight = TOGGLE_WIDTH - HANDLE_SIZE - SPACING * 2;

export const ThemeToggle = () => {
  const { themePreference, colorMode, setThemePreference } = useTheme();

  const inactiveIconColor = colorMode === 'dark' ? colors.typography.gray : colors.primary.disabled;

  const animatedHandleStyle = useAnimatedStyle(() => {
    let targetX = positionCenter;

    if (themePreference === 'light') targetX = positionLeft;
    if (themePreference === 'dark') targetX = positionRight;

    return {
      transform: [{ translateX: withSpring(targetX, { damping: 25, stiffness: 180 }) }],
    };
  });

  const handlePress = () => {
    if (themePreference === 'light') {
      setThemePreference('system');
    } else if (themePreference === 'system') {
      setThemePreference('dark');
    } else {
      setThemePreference('light');
    }
  };

  const getHandleIcon = () => {
    switch (themePreference) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      case 'system':
        return 'monitor';
    }
  };

  const getHandleIconColor = () => {
    switch (themePreference) {
      case 'light':
        return colors.assets.sun;
      case 'dark':
        return colors.assets.moon;
      case 'system':
        return colors.primary;
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        style={{ width: TOGGLE_WIDTH, height: TOGGLE_HEIGHT, paddingHorizontal: SPACING }}
        className="rounded-full flex-row items-center justify-between bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 relative"
      >
        <View className="absolute inset-0 flex-row justify-between items-center px-3 opacity-40">
          <Feather name="sun" size={14} color={inactiveIconColor} />
          <Feather name="monitor" size={14} color={inactiveIconColor} />
          <Feather name="moon" size={14} color={inactiveIconColor} />
        </View>

        <Animated.View
          style={[{ width: HANDLE_SIZE, height: HANDLE_SIZE }, animatedHandleStyle]}
          className="rounded-full bg-white dark:bg-zinc-200 shadow-md items-center justify-center z-10"
        >
          <Feather
            name={getHandleIcon()}
            color={getHandleIconColor()}
            size={16}
            className="text-zinc-800 dark:text-zinc-900"
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};
