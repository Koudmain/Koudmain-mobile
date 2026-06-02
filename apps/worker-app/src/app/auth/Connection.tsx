import { router } from 'expo-router';
import { Text, View, Image, useColorScheme } from 'react-native';

import { Button } from '@koudmain/ui/gluestack';

import logo from '@/assets/images/logo/logo_v1.2_only_transparant.png';
import logo_white from '@/assets/images/logo/logo_v1.2_only_transparant_white.png';

export default function Connection() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <Text className="text-4xl font-bold text-center pt-10 text-primary dark:text-white">
        Bienvenue
      </Text>
      <Image
        source={isDark ? logo_white : logo}
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
