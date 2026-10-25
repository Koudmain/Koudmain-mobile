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
 * A single card in the grid view.
 * Shows a larger thumbnail/icon and a short truncated title + date.
 */
export function DocumentGridItem({ document, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';

  const formattedDate = new Date(document.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  return (
    <Pressable
      onPress={() => onPress?.(document)}
      className="items-center m-2 active:opacity-70"
      style={{ width: 80 }}
    >
      {/* Thumbnail */}
      <View
        className="w-20 h-24 rounded-lg overflow-hidden items-center justify-center border border-primary-100 dark:border-primary-hover"
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
          <View className="items-center justify-center w-full h-full">
            <Feather
              name="file-text"
              size={26}
              color={isDark ? colors.primary.light : colors.secondary.DEFAULT}
            />
            <Text size="2xs" className="text-secondary font-bold uppercase mt-1">
              PDF
            </Text>
          </View>
        )}

        {document.isNew && (
          <View className="absolute top-1 right-1 bg-secondary rounded-full w-2 h-2" />
        )}
      </View>

      {/* Label */}
      <Text
        size="2xs"
        className="text-primary dark:text-primary-content text-center mt-1 font-medium"
        numberOfLines={2}
      >
        CEDU du{'\n'}
        {formattedDate}
      </Text>
    </Pressable>
  );
}
