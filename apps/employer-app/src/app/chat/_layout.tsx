import { colors } from '@/constants/theme';
import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Retour',
        headerTintColor: colors?.primary.DEFAULT,
        headerTitleAlign: 'left',
      }}
    />
  );
}
