import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Heading, Text } from '@koudmain/ui/gluestack';
import Feather from '@expo/vector-icons/Feather';
import Reanimated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/constants/theme';

export default function EmptyPublications() {
  const router = useRouter();

  return (
    <Reanimated.View
      entering={FadeInDown.duration(500).springify()}
      className="items-center px-8"
      style={{ flexGrow: 1, justifyContent: 'center' }}
    >
      <View className="items-center justify-center mb-6" style={{ width: 96, height: 96 }}>
        <View
          className="items-center justify-center rounded-full bg-secondary-50"
          style={{ width: 96, height: 96 }}
        >
          <Feather name="file-plus" size={36} color={colors.secondary.DEFAULT} />
        </View>
      </View>

      <Heading className="text-xl font-bold text-center">
        Vous n&apos;avez pas encore de publication en ligne
      </Heading>
      <Text className="text-sm text-gray-500 text-center mt-3 leading-5">
        Créez votre première offre pour la rendre visible auprès des travailleurs et commencer à
        recevoir des candidatures.
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/CreatePost')}
        activeOpacity={0.85}
        className="flex-row items-center bg-secondary rounded-full px-6 py-3 mt-8"
      >
        <Feather name="plus" size={18} color="white" />
        <Text className="text-white text-base font-semibold ml-2">Créer une publication</Text>
      </TouchableOpacity>
    </Reanimated.View>
  );
}
