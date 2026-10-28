import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Heading } from '@koudmain/ui/gluestack';
import { useSession } from '@koudmain/ui/context/SessionContext';

interface UserHeaderProps {
  onPress: () => void;
}

export function UserHeader({ onPress }: UserHeaderProps) {
  const { user } = useSession();

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Voir mon profil"
      className="items-center pb-8 border-b border-primary-disabled mb-6 active:opacity-60"
    >
      <View className="size-24 rounded-full bg-gray-200 overflow-hidden mb-4 shadow-sm border-neutral-300">
        <Image
          source={{
            uri:
              user?.profile_picture_url ||
              'https://www.cuisine-essentiel.fr/images/2020/10/avatar-neutre.png',
          }}
          className="size-full"
        />
      </View>

      <Heading size="md" className="text-primary dark:text-white text-center">
        {user?.first_name} {user?.last_name}
      </Heading>
    </Pressable>
  );
}
