import { ReactNode } from 'react';
import { Image, Pressable, useColorScheme, View } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Text } from '../ui';
import { colors } from '../../constants/theme';

export interface PlanningProfileRowProps {
  name: string;
  imageUri: string | null;
  rating: number;
  ratingCount: number;
  fallbackIcon?: 'user' | 'store';
  caption?: string;
  right?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
}

const formatRating = (rating: number) =>
  Number.isFinite(rating) ? rating.toString().replace('.', ',') : '0';

export default function PlanningProfileRow({
  name,
  imageUri,
  rating,
  ratingCount,
  fallbackIcon = 'user',
  caption,
  right,
  onPress,
  accessibilityLabel,
}: PlanningProfileRowProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      className="flex-row items-center active:opacity-60"
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} className="w-12 h-12 rounded-full mr-3" />
      ) : (
        <View className="w-12 h-12 rounded-full mr-3 bg-gray-300 items-center justify-center">
          <FontAwesome5 name={fallbackIcon} size={22} color={colors.typography.white} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-sm font-bold text-primary dark:text-primary-200" numberOfLines={1}>
          {name}
        </Text>
        <View className="flex-row items-center mt-0.5">
          {caption ? (
            <>
              <Text className="text-2xs font-medium text-primary-400 shrink" numberOfLines={1}>
                {caption}
              </Text>
              <Text className="text-2xs font-medium text-primary-400 mx-1.5">·</Text>
            </>
          ) : null}
          <MaterialIcons
            name="star"
            size={16}
            color={isDark ? colors.primary[200] : colors.primary.DEFAULT}
          />
          <Text className="text-2xs font-bold text-primary-500 dark:text-primary-300 ml-1">
            {formatRating(rating)} ({ratingCount})
          </Text>
        </View>
      </View>
      {right ? <View className="ml-2">{right}</View> : null}
    </Pressable>
  );
}
