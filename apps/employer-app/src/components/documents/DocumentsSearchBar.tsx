import React from 'react';
import { View, TextInput, Pressable, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

/**
 * Search bar displayed at the top of the Documents screen.
 * Easily replaceable with a real debounced API search later.
 */
export function DocumentsSearchBar({ value, onChangeText, onClear }: Props) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? colors.primary.content : colors.primary.disabled;
  const activeIconColor = isDark ? colors.secondary.DEFAULT : colors.secondary.DEFAULT;

  return (
    <View className="flex-row items-center bg-secondary-50 dark:bg-primary-hover rounded-full px-4 py-2 mx-4 mb-4">
      <Feather name="search" size={16} color={iconColor} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher un document..."
        placeholderTextColor={isDark ? colors.primary.light : colors.primary.disabled}
        className="flex-1 ml-2 text-primary dark:text-white text-sm"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Feather name="x-circle" size={16} color={activeIconColor} />
        </Pressable>
      )}
    </View>
  );
}
