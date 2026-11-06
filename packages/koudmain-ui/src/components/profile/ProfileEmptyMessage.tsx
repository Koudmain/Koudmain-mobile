import { Text, View, useColorScheme } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../constants/theme';
import { cnFusion } from '../../utils/cnFusion';

interface ProfileEmptyMessageProps {
  message: string;
  className?: string;
}

export default function ProfileEmptyMessage({ message, className }: ProfileEmptyMessageProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View
      className={cnFusion(
        'flex-row items-center p-4 rounded-lg bg-primary-50 dark:bg-primary-700',
        className,
      )}
    >
      <MaterialIcons
        name="info-outline"
        size={20}
        color={isDark ? colors.primary[300] : colors.primary[600]}
      />
      <Text className="flex-1 ml-3 text-sm text-primary-600 dark:text-primary-300">{message}</Text>
    </View>
  );
}
