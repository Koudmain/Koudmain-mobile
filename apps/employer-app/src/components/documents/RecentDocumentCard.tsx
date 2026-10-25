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

/** Small card used in the horizontal "Récents" scroll. */
export function RecentDocumentCard({ document, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';

  const shortTitle =
    document.title.length > 18 ? document.title.slice(0, 15) + '…' : document.title;

  return (
    <Pressable
      onPress={() => onPress?.(document)}
      className="items-center mr-3"
      style={{ width: 72 }}
    >
      {/* Thumbnail or PDF icon */}
      <View
        className="w-16 h-20 rounded-lg overflow-hidden items-center justify-center border border-primary-100 dark:border-primary-hover"
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
              size={28}
              color={isDark ? colors.primary.light : colors.secondary.DEFAULT}
            />
            <Text size="2xs" className="text-secondary font-bold uppercase mt-1">
              PDF
            </Text>
          </View>
        )}
      </View>

      <Text
        size="2xs"
        className="text-primary dark:text-primary-content text-center mt-1"
        numberOfLines={2}
      >
        {shortTitle}
      </Text>
    </Pressable>
  );
}
