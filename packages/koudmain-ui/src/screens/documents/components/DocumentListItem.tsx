import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../../../constants/theme';
import { DocumentItem } from '../types';
import { DocumentThumbnail } from '../DocumentThumbnail';

interface DocumentListItemProps {
  item: DocumentItem;
  isOpening?: boolean;
  onPress: (item: DocumentItem) => void;
}

export function DocumentListItem({ item, isOpening = false, onPress }: DocumentListItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      className="flex-row items-center justify-between py-3"
    >
      <View className="flex-1 pr-3">
        <Text className="text-sm font-medium text-neutral-900 dark:text-white leading-snug">
          {item.title}
        </Text>
        <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{item.date}</Text>
      </View>
      {isOpening ? (
        <View className="w-8 h-10 items-center justify-center">
          <ActivityIndicator size="small" color={colors.secondary.DEFAULT} />
        </View>
      ) : (
        <DocumentThumbnail type={item.thumbnailType} size="sm" />
      )}
    </TouchableOpacity>
  );
}
