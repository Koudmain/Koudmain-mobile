import { router } from 'expo-router';
import { Text, View, Image, useColorScheme, ImageSourcePropType } from 'react-native';

import { Button } from '../../components/ui/index';

type ConnectionScreenProps = {
  logoLight: ImageSourcePropType;
  logoDark: ImageSourcePropType;
};

export function ConnectionScreen({ logoLight, logoDark }: ConnectionScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <Text className="text-4xl font-bold text-center pt-10 text-primary dark:text-white">
        Bienvenue
      </Text>
      <Image
        source={isDark ? logoDark : logoLight}
        className="w-72 h-96 mx-auto pt-6 mt-20"
        resizeMode="contain"
      />
      <View className="px-12 mt-36">
        <Button
          label="Connexion"
          variant="secondary"
          onPress={() => {
            router.push('/auth/SignIn');
          }}
        />
        <Button
          label="Inscription"
          variant="primary"
          className="mt-10"
          onPress={() => {
            router.push('/auth/register/RegisterEmail');
          }}
        />
      </View>
    </View>
  );
}
