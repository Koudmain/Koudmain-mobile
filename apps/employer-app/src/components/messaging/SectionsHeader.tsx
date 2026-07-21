import { colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  if (!title) return <View className="h-4" />;

  return (
    <View className="flex-row items-center px-6 py-4 bg-white dark:bg-primary">
      {icon && (
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={18}
          className="mr-2 text-primary-500"
          color={colors.primary.disabled}
        />
      )}
      <Text className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {title}
      </Text>
    </View>
  );
}

export default SectionHeader;
