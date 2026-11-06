import { Text, View } from 'react-native';
import { IRatingSummary } from '../../../types/profile';
import StarRating from './StarRating';

const BAR_COLORS = {
  5: 'bg-rating-5',
  4: 'bg-rating-4',
  3: 'bg-rating-3',
  2: 'bg-rating-2',
  1: 'bg-rating-1',
} as const;

interface RatingSummaryCardProps {
  rating: IRatingSummary;
}

export default function RatingSummaryCard({ rating }: RatingSummaryCardProps) {
  return (
    <View
      className="flex-row p-5 rounded-[16] bg-white dark:bg-primary-700 shadow-md"
      style={{ elevation: 4 }}
    >
      <View className="mr-6 justify-center">
        <Text className="text-5xl font-bold text-primary dark:text-white">
          {rating.average.toFixed(1).replace('.', ',')}
        </Text>
        <StarRating rating={rating.average} size={18} />
        <Text className="mt-2 text-sm text-primary-600 dark:text-primary-300">
          {rating.count} avis
        </Text>
      </View>

      <View className="flex-1 justify-center gap-1">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = rating.distribution[star] ?? 0;
          const percent = rating.count > 0 ? (count / rating.count) * 100 : 0;

          return (
            <View key={star} className="flex-row items-center">
              <Text className="w-4 text-xs text-primary-600 dark:text-primary-300">{star}</Text>
              <View className="flex-1 h-1.5 rounded-full overflow-hidden bg-rating-track dark:bg-primary-400">
                <View
                  className={`h-full rounded-full ${BAR_COLORS[star]}`}
                  style={{ width: `${percent}%` }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
