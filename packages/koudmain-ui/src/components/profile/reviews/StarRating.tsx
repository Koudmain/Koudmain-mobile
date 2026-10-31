import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../../constants/theme';

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 20 }: StarRatingProps) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => {
        const name = rating >= star ? 'star' : rating >= star - 0.5 ? 'star-half' : 'star-border';

        return <MaterialIcons key={star} name={name} size={size} color={colors.utils.star} />;
      })}
    </View>
  );
}
