import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { colors } from '../../../constants/theme';
import { FolderType } from '../types';

interface DocumentHeaderProps {
  selectedFolder?: FolderType | null;
  onBack: () => void;
}

export function DocumentHeader({ selectedFolder, onBack }: DocumentHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-neutral-800"
      >
        <Feather name="chevron-left" size={24} color={colors.secondary.DEFAULT} />
      </TouchableOpacity>

      <View className="flex-1 flex-row items-center justify-center -ml-2">
        {selectedFolder && (
          <Feather
            name="folder"
            size={18}
            color={colors.secondary.DEFAULT}
            style={{ marginRight: 6 }}
          />
        )}
        <Text className="text-base font-semibold text-neutral-900 dark:text-white">
          {selectedFolder ? selectedFolder : 'Documents'}
        </Text>
      </View>

      <View className="w-10" />
    </View>
  );
}
