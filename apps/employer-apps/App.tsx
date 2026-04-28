import { KoudmainButton } from '@koudmain/ui/components/KoudmainButton';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-secondary">
      <KoudmainButton title="Press me!" onPress={() => console.log('Button pressed!')} />
    </View>
  );
}

