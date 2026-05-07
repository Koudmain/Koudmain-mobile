import React from 'react';
import { View, Image } from 'react-native';
import { Heading } from '@/components/ui/heading';
import { useSession } from '@/context/SessionContext';

export function UserHeader() {
  const { user } = useSession();

  return (
    <View className="items-center pb-8 border-b border-primary-disabled mb-6">
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
    </View>
  );
}
