import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../../../constants/theme';
import { DocumentItem } from '../types';
import { DocumentThumbnail } from '../DocumentThumbnail';

interface DocumentGridItemProps {
  item: DocumentItem;
  isOpening?: boolean;
  onPress: (item: DocumentItem) => void;
}

export function DocumentGridItem({ item, isOpening = false, onPress }: DocumentGridItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      className="w-[30%] mb-3 items-center"
    >
      <View className="w-full aspect-[4/5] rounded-2xl bg-gray-50 dark:bg-[#2C2C2E] border border-gray-100 dark:border-neutral-800 items-center justify-center p-2 mb-1.5 shadow-2xs">
        {isOpening ? (
          <ActivityIndicator size="small" color={colors.secondary.DEFAULT} />
        ) : (
          <DocumentThumbnail type={item.thumbnailType} size="md" />
        )}
      </View>
      <Text
        numberOfLines={2}
        className="text-[11px] font-medium text-center text-neutral-800 dark:text-neutral-200"
      >
        {item.shortTitle || item.title}
      </Text>
    </TouchableOpacity>
  );
}
