import React from 'react';
import { ScrollView, View, Pressable, useColorScheme } from 'react-native';
import { Text } from '@koudmain/ui/gluestack';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { FAKE_FOLDERS, type DocumentCategory } from '@/constants/fakeDocuments';
import { FolderCard } from './FolderCard';

interface Props {
  activeCategory: DocumentCategory | null;
  onSelectCategory: (id: DocumentCategory | null) => void;
}

/**
 * Horizontally scrollable row of folder cards + "Listes" toggle row.
 * Tapping the same folder a second time deselects it (shows all documents).
 */
export function FolderSection({ activeCategory, onSelectCategory }: Props) {
  const isDark = useColorScheme() === 'dark';

  const handlePress = (id: DocumentCategory) => {
    onSelectCategory(activeCategory === id ? null : id);
  };

  return (
    <View className="mb-4">
      {/* "Listes" sub-header row */}
      <Pressable
        onPress={() => onSelectCategory(null)}
        className="flex-row items-center justify-between px-4 py-2 mx-4 mb-3 rounded-lg bg-secondary-50 dark:bg-primary-hover active:opacity-70"
      >
        <View className="flex-row items-center gap-2">
          <Feather
            name="list"
            size={16}
            color={isDark ? colors.primary.content : colors.secondary.DEFAULT}
          />
          <Text className="text-primary dark:text-white font-semibold ml-2">Listes</Text>
        </View>
        <Feather
          name="chevron-right"
          size={16}
          color={isDark ? colors.primary.light : colors.primary.disabled}
        />
      </Pressable>

      {/* Horizontal folder cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {FAKE_FOLDERS.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            isActive={activeCategory === folder.id}
            onPress={handlePress}
          />
        ))}
      </ScrollView>
    </View>
  );
}
