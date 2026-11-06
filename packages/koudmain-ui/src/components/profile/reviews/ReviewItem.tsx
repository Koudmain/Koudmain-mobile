import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../../constants/theme';
import { IProfileReview } from '../../../types/profile';
import { formatReviewDate } from '../../../utils/date';

const COMMENT_PREVIEW_LENGTH = 140;

interface ReviewItemProps {
  review: IProfileReview;
  onAuthorPress?: () => void;
}

export default function ReviewItem({ review, onAuthorPress }: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const comment = review.comment?.trim();
  const isLong = !!comment && comment.length > COMMENT_PREVIEW_LENGTH;

  return (
    <View className="flex-row py-4 border-t border-primary-200 dark:border-primary-400">
      <Pressable onPress={onAuthorPress} disabled={!onAuthorPress}>
        {review.author.pictureUrl ? (
          <Image source={{ uri: review.author.pictureUrl }} className="w-12 h-12 rounded-full" />
        ) : (
          <View className="w-12 h-12 rounded-full items-center justify-center bg-secondary-50">
            <Text className="text-lg font-bold text-secondary">{review.author.name.charAt(0)}</Text>
          </View>
        )}
      </Pressable>

      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text
            className="flex-shrink text-base font-bold text-primary dark:text-white"
            numberOfLines={1}
            onPress={onAuthorPress}
            suppressHighlighting
          >
            {review.author.name}
          </Text>
          <View className="flex-row items-center ml-2">
            <MaterialIcons name="star" size={20} color={colors.utils.star} />
            <Text className="ml-0.5 text-base font-bold text-primary dark:text-white">
              {review.rating}
            </Text>
          </View>
          <Text className="ml-auto pl-2 text-[10px] font-bold text-primary dark:text-white">
            {formatReviewDate(review.createdAt)}
          </Text>
        </View>

        {comment ? (
          <Text className="mt-1 text-sm text-primary dark:text-white">
            {isLong && !isExpanded
              ? `${comment.slice(0, COMMENT_PREVIEW_LENGTH).trim()} `
              : comment}
            {isLong && (
              <Text
                className="text-primary-500 dark:text-primary-300"
                onPress={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? ' Voir moins' : '...Voir plus'}
              </Text>
            )}
          </Text>
        ) : (
          <Text className="mt-1 text-sm italic text-primary-500 dark:text-primary-300">
            Avis sans commentaire
          </Text>
        )}
      </View>
    </View>
  );
}
