import React from 'react';
import { View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';

interface HeaderChatProps {
  userName: string;
  publicationTitle: string;
  userImage?: string;
}

export const HeaderChat = ({ userName, publicationTitle, userImage }: HeaderChatProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="bg-white dark:bg-primary flex-row items-center justify-between w-full px-2">
      <View className="flex-row items-center flex-1">
        <TouchableOpacity onPress={() => router.back()} className="pr-2">
          <Ionicons
            name="chevron-back"
            size={28}
            color={isDark ? colors.primary.content : colors.primary.DEFAULT}
          />
        </TouchableOpacity>

        <View className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden mr-3">
          {userImage ? (
            <Image source={{ uri: userImage }} className="flex-1" />
          ) : (
            <View className="flex-1 items-center justify-center bg-primary-100">
              <Text className="text-primary-600 font-bold">{userName.charAt(0)}</Text>
            </View>
          )}
        </View>

        <View className="flex-1">
          <Text className="font-bold text-[16px] dark:text-white" numberOfLines={1}>
            {userName}
          </Text>
          <View className="flex-row items-center">
            <Text
              className="text-[10px] text-primary-disabled uppercase font-bold tracking-tight"
              numberOfLines={1}
            >
              {publicationTitle}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity className="p-2">
        <Ionicons name="ellipsis-vertical" size={20} color={colors.primary.disabled} />
      </TouchableOpacity>
    </View>
  );
};
