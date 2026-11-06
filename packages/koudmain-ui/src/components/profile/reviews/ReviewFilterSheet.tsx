import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Switch } from '../../ui';
import { colors } from '../../../constants/theme';
import { cnFusion } from '../../../utils/cnFusion';
import {
  REVIEW_SORT_LABELS,
  ReviewFilters,
  ReviewSort,
  defaultReviewFilters,
} from './reviewFilters';

interface ReviewFilterSheetProps {
  isVisible: boolean;
  filters: ReviewFilters;
  onApply: (filters: ReviewFilters) => void;
  onClose: () => void;
  countResults: (filters: ReviewFilters) => number;
}

export default function ReviewFilterSheet({
  isVisible,
  filters,
  onApply,
  onClose,
  countResults,
}: ReviewFilterSheetProps) {
  const isDark = useColorScheme() === 'dark';
  const [draft, setDraft] = useState<ReviewFilters>(filters);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(isVisible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setIsMounted(false);
      });
    }
  }, [isVisible, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  useEffect(() => {
    if (isVisible) {
      setDraft(filters);
      setIsSortOpen(false);
    }
  }, [isVisible, filters]);

  const toggleRating = (rating: number) => {
    setDraft((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating],
    }));
  };

  const selectSort = (sort: ReviewSort) => {
    setDraft((prev) => ({ ...prev, sort }));
    setIsSortOpen(false);
  };

  const resultsCount = countResults(draft);
  const separatorClass = 'h-px my-4 bg-primary-200 dark:bg-primary-400';

  return (
    <Modal animationType="none" transparent visible={isMounted} onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View className="absolute inset-0 bg-black/60" style={{ opacity: progress }}>
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>
        <Animated.View
          className="px-6 pt-3 pb-8 rounded-t-[24] bg-white dark:bg-primary"
          style={{ transform: [{ translateY }] }}
        >
          <View className="self-center w-24 h-1.5 mb-5 rounded-full bg-primary-200 dark:bg-primary-400" />

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-lg font-semibold text-primary dark:text-white">
              Filtrer les avis
            </Text>
            <TouchableOpacity onPress={() => setDraft(defaultReviewFilters)}>
              <Text className="text-base font-semibold text-secondary">Réinitialiser</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            {[5, 4, 3, 2, 1].map((rating) => {
              const isSelected = draft.ratings.includes(rating);

              return (
                <TouchableOpacity
                  key={rating}
                  onPress={() => toggleRating(rating)}
                  activeOpacity={0.7}
                  className={cnFusion(
                    'flex-row items-center px-3 py-1.5 rounded-full border',
                    isSelected
                      ? 'bg-secondary-50 border-secondary dark:bg-transparent'
                      : 'border-primary-200 dark:border-primary-400',
                  )}
                >
                  <MaterialIcons name="star" size={18} color={colors.utils.star} />
                  <Text className="ml-1 text-base font-bold text-primary dark:text-white">
                    {rating}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className={separatorClass} />

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-primary dark:text-white">
              Avec commentaire uniquement
            </Text>
            <Switch
              size="md"
              value={draft.withCommentOnly}
              onValueChange={(value: boolean) =>
                setDraft((prev) => ({ ...prev, withCommentOnly: value }))
              }
              trackColor={{
                false: isDark ? colors.primary.disabled : colors.primary[200],
                true: colors.secondary.DEFAULT,
              }}
              thumbColor={colors.surface.card}
              ios_backgroundColor={isDark ? colors.primary.disabled : colors.primary[200]}
            />
          </View>

          <View className={separatorClass} />

          <TouchableOpacity
            onPress={() => setIsSortOpen(!isSortOpen)}
            className="flex-row items-center justify-between"
          >
            <Text className="text-base text-primary dark:text-white">
              Trier par{' '}
              <Text className="font-semibold text-secondary">{REVIEW_SORT_LABELS[draft.sort]}</Text>
            </Text>
            <MaterialIcons
              name={isSortOpen ? 'expand-less' : 'expand-more'}
              size={24}
              color={isDark ? colors.primary.content : colors.primary.DEFAULT}
            />
          </TouchableOpacity>

          {isSortOpen && (
            <View className="mt-2">
              {(Object.keys(REVIEW_SORT_LABELS) as ReviewSort[]).map((sort) => (
                <TouchableOpacity key={sort} onPress={() => selectSort(sort)} className="py-2">
                  <Text
                    className={cnFusion(
                      'text-base',
                      sort === draft.sort
                        ? 'font-semibold text-secondary'
                        : 'text-primary dark:text-white',
                    )}
                  >
                    {REVIEW_SORT_LABELS[sort].charAt(0).toUpperCase() +
                      REVIEW_SORT_LABELS[sort].slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="flex-row gap-4 mt-8">
            <TouchableOpacity
              onPress={() => onApply(defaultReviewFilters)}
              activeOpacity={0.8}
              className="flex-1 py-3.5 items-center rounded-lg border border-primary dark:border-white"
            >
              <Text className="text-base font-semibold text-primary dark:text-white">
                Réinitialiser
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onApply(draft)}
              activeOpacity={0.8}
              className="flex-1 py-3.5 items-center rounded-lg bg-secondary"
            >
              <Text className="text-base font-semibold text-white">Voir {resultsCount} avis</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
