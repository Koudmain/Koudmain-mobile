import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';

type AuthTopProps = {
  title: string;
};

export default function AuthTop({ title }: AuthTopProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="pl-4 mt-9 flex-row items-center gap-4">
      <TouchableOpacity onPress={() => router.back()}>
        <Entypo name="chevron-left" size={32} color={isDark ? 'white' : 'black'} />
      </TouchableOpacity>
      <Text className="text-4xl font-bold text-center text-primary dark:text-white">{title}</Text>
    </View>
  );
}
