import { Text, TouchableOpacity } from 'react-native';

export const KoudmainButton = ({ title, onPress }: { title: string, onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-primary p-4 rounded-xl items-center justify-center"
    >
      <Text className="text-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
};