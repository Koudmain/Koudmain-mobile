import React from 'react';
import { Pressable, View, Image, useColorScheme } from 'react-native';
import { Text } from '@koudmain/ui/gluestack';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import type { FakeDocument } from '@/constants/fakeDocuments';

interface Props {
  document: FakeDocument;
  onPress?: (doc: FakeDocument) => void;
}

/**
 * A single row in the list view.
 * Shows title, worker name, date and a thumbnail or PDF badge.
 */
export function DocumentListItem({ document, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';

  const formattedDate = new Date(document.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Pressable
      onPress={() => onPress?.(document)}
      className="flex-row items-center px-4 py-3 active:bg-secondary-50 dark:active:bg-primary-hover"
    >
      {/* Left: doc thumbnail / icon */}
      <View
        className="w-12 h-14 rounded-lg overflow-hidden items-center justify-center border border-primary-100 dark:border-primary-hover mr-3 flex-shrink-0"
        style={{
          backgroundColor: isDark ? colors.primary.hover : colors.secondary[50],
        }}
      >
        {document.fileType === 'image' && document.thumbnailUri ? (
          <Image
            source={{ uri: document.thumbnailUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <>
            <Feather
              name="file-text"
              size={20}
              color={isDark ? colors.primary.light : colors.secondary.DEFAULT}
            />
            <Text size="2xs" className="text-secondary font-bold uppercase mt-0.5">
              PDF
            </Text>
          </>
        )}
      </View>

      {/* Middle: title + metadata */}
      <View className="flex-1">
        <View className="flex-row items-center flex-wrap">
          <Text
            className="text-primary dark:text-white font-semibold text-sm flex-shrink"
            numberOfLines={2}
          >
            {document.title}
          </Text>
          {document.isNew && (
            <View className="bg-secondary rounded-full px-2 py-0.5 ml-2">
              <Text size="2xs" className="text-white font-bold">
                NEW
              </Text>
            </View>
          )}
        </View>

        {document.workerName ? (
          <Text size="xs" className="text-primary-disabled mt-0.5" numberOfLines={1}>
            {document.workerName}
          </Text>
        ) : null}

        <Text size="xs" className="text-primary-disabled mt-0.5">
          {formattedDate}
        </Text>
      </View>

      {/* Right: chevron */}
      <Feather
        name="chevron-right"
        size={16}
        color={isDark ? colors.primary.light : colors.primary.disabled}
      />
    </Pressable>
  );
}
