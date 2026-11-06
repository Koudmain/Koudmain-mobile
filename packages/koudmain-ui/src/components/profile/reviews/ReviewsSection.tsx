import { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import IconButton from '../../utils/IconButton';
import { colors } from '../../../constants/theme';
import { cnFusion } from '../../../utils/cnFusion';
import { IProfileReview, IRatingSummary } from '../../../types/profile';
import ProfileEmptyMessage from '../ProfileEmptyMessage';
import RatingSummaryCard from './RatingSummaryCard';
import ReviewItem from './ReviewItem';
import ReviewFilterSheet from './ReviewFilterSheet';
import {
  ReviewFilters,
  applyReviewFilters,
  countActiveReviewFilters,
  defaultReviewFilters,
} from './reviewFilters';

interface ReviewsSectionProps {
  rating: IRatingSummary;
  reviews: IProfileReview[];
  emptyMessage: string;
  onAuthorPress?: (profileId: number) => void;
}

export default function ReviewsSection({
  rating,
  reviews,
  emptyMessage,
  onAuthorPress,
}: ReviewsSectionProps) {
  const isDark = useColorScheme() === 'dark';
  const [filters, setFilters] = useState<ReviewFilters>(defaultReviewFilters);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const filteredReviews = useMemo(() => applyReviewFilters(reviews, filters), [reviews, filters]);
  const activeFiltersCount = countActiveReviewFilters(filters);

  if (reviews.length === 0) {
    return <ProfileEmptyMessage message={emptyMessage} className="mt-6" />;
  }

  const chips = [
    {
      label: 'Tous',
      isActive: activeFiltersCount === 0,
      onPress: () => setFilters(defaultReviewFilters),
    },
    {
      label: 'Avec commentaire',
      isActive: filters.withCommentOnly,
      onPress: () => setFilters({ ...filters, withCommentOnly: true }),
    },
  ];

  return (
    <View className="mt-6">
      <RatingSummaryCard rating={rating} />

      <View className="flex-row items-center mt-6 mb-4">
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip.label}
            activeOpacity={0.7}
            onPress={chip.onPress}
            className={cnFusion(
              'mr-2 px-4 py-1 rounded-full border-2 border-secondary',
              chip.isActive && 'bg-secondary',
            )}
          >
            <Text
              className={cnFusion(
                'text-sm font-bold',
                chip.isActive ? 'text-white' : 'text-secondary',
              )}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}

        <View className="ml-auto">
          <IconButton
            className="p-2.5 dark:bg-primary-700"
            onPress={() => setIsFilterVisible(true)}
            icon={
              <MaterialIcons
                name="filter-list"
                size={22}
                color={isDark ? colors.primary.content : colors.secondary.DEFAULT}
              />
            }
          />
          {activeFiltersCount > 0 && (
            <View className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full items-center justify-center bg-error">
              <Text className="text-[10px] font-bold text-white">{activeFiltersCount}</Text>
            </View>
          )}
        </View>
      </View>

      {filteredReviews.length > 0 ? (
        filteredReviews.map((review) => {
          const { profileId } = review.author;
          return (
            <ReviewItem
              key={review.id}
              review={review}
              onAuthorPress={
                onAuthorPress && profileId ? () => onAuthorPress(profileId) : undefined
              }
            />
          );
        })
      ) : (
        <ProfileEmptyMessage message="Aucun avis ne correspond à vos filtres." />
      )}

      <ReviewFilterSheet
        isVisible={isFilterVisible}
        filters={filters}
        countResults={(draft) => applyReviewFilters(reviews, draft).length}
        onClose={() => setIsFilterVisible(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setIsFilterVisible(false);
        }}
      />
    </View>
  );
}
