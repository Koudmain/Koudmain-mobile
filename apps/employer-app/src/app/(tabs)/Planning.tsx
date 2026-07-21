import CalendarComponent from '@/components/planning/Calendar';
import { colors } from '@/constants/theme';
import { Text, View, ScrollView, useColorScheme } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function Planning() {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  return (
    <ScrollView className="bg-white dark:bg-primary pt-10 bg-surface flex-1">
      <Text className="text-4xl font-bold pt-6 px-6 dark:text-white">Mon Planning</Text>

      <View className="flex-1 m-6 rounded-lg">
        <Shadow
          startColor={isDark ? colors.shadow.dark : colors.shadow.light}
          style={{
            borderRadius: 24,
            width: '100%',
            marginBottom: 16,
            backgroundColor: isDark ? colors.background.dark : colors.background.light,
          }}
        >
          <CalendarComponent />
        </Shadow>
      </View>
    </ScrollView>
  );
}
