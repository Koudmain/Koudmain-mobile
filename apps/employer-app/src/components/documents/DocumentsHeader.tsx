import React from 'react';
import { View, Pressable, useColorScheme } from 'react-native';
import { Text } from '@koudmain/ui/gluestack';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import type { DocumentCategory } from '@/constants/fakeDocuments';
import { FAKE_FOLDERS } from '@/constants/fakeDocuments';

type ViewMode = 'list' | 'grid';

interface Props {
  activeCategory: DocumentCategory | null;
  viewMode: ViewMode;
  onToggleView: () => void;
}

/**
 * Top navigation bar for the Documents screen.
 * Shows a back arrow, the current folder name (or "Documents"),
 * and a list/grid toggle button.
 */
export function DocumentsHeader({ activeCategory, viewMode, onToggleView }: Props) {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  const folderLabel = activeCategory
    ? (FAKE_FOLDERS.find((f) => f.id === activeCategory)?.label ?? 'Documents')
    : 'Documents';

  const iconColor = isDark ? colors.primary.content : colors.primary.DEFAULT;

  return (
    <View className="flex-row items-center px-4 pb-3 pt-1">
      {/* Back button */}
      <Pressable onPress={() => router.back()} hitSlop={12} className="active:opacity-60 mr-3">
        <Feather name="arrow-left" size={22} color={iconColor} />
      </Pressable>

      {/* Title */}
      {activeCategory ? (
        <View className="flex-row items-center flex-1 gap-2">
          <View className="w-7 h-7 rounded-lg bg-secondary items-center justify-center mr-1">
            <Feather
              name={
                (FAKE_FOLDERS.find((f) => f.id === activeCategory)?.iconName as ComponentProps<
                  typeof Feather
                >['name']) ?? 'folder'
              }
              size={14}
              color={colors.secondary.content}
            />
          </View>
          <Text className="text-primary dark:text-white font-bold text-xl">{folderLabel}</Text>
        </View>
      ) : (
        <Text className="text-primary dark:text-white font-bold text-xl flex-1">{folderLabel}</Text>
      )}

      {/* View toggle (list ↔ grid) */}
      <Pressable
        onPress={onToggleView}
        hitSlop={12}
        className="active:opacity-60 bg-secondary-50 dark:bg-primary-hover rounded-lg p-2"
      >
        <Feather
          name={viewMode === 'list' ? 'grid' : 'list'}
          size={18}
          color={isDark ? colors.primary.content : colors.secondary.DEFAULT}
        />
      </Pressable>
    </View>
  );
}
