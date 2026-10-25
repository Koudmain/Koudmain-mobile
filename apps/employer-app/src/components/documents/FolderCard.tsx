import React from 'react';
import { Pressable, View, useColorScheme } from 'react-native';
import { Text } from '@koudmain/ui/gluestack';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { colors } from '@/constants/theme';
import type { FakeFolder, DocumentCategory } from '@/constants/fakeDocuments';

interface Props {
  folder: FakeFolder;
  isActive: boolean;
  onPress: (id: DocumentCategory) => void;
}

/**
 * A single folder card (Contrats / Factures / Personnel).
 * Shows an icon, label and document count.
 */
export function FolderCard({ folder, isActive, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';

  return (
    <Pressable
      onPress={() => onPress(folder.id)}
      className={`items-center justify-center rounded-lg p-3 mx-2 ${
        isActive ? 'bg-secondary' : isDark ? 'bg-primary-hover' : 'bg-secondary-50'
      }`}
      style={{ width: 88 }}
    >
      {/* Folder icon container */}
      <View
        className={`w-12 h-12 rounded-lg items-center justify-center mb-2 ${
          isActive ? 'bg-secondary-hover' : 'bg-secondary-100'
        }`}
      >
        <Feather
          name={folder.iconName as ComponentProps<typeof Feather>['name']}
          size={22}
          color={isActive ? colors.secondary.content : colors.secondary.DEFAULT}
        />
      </View>

      <Text
        size="xs"
        className={`font-semibold text-center ${
          isActive ? 'text-white' : 'text-primary dark:text-primary-content'
        }`}
        numberOfLines={1}
      >
        {folder.label}
      </Text>

      <Text
        size="2xs"
        className={`mt-0.5 ${isActive ? 'text-secondary-100' : 'text-primary-disabled'}`}
      >
        {folder.count} docs
      </Text>
    </Pressable>
  );
}
