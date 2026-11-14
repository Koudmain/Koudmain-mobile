import React from 'react';
import { View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../../constants/theme';

export interface HeaderChatProps {
  userName?: string;
  publicationTitle?: string;
  userImage?: string | null;
  companyId?: number;
}

export const HeaderChat = ({
  userName = '',
  publicationTitle = '',
  userImage,
  companyId,
}: HeaderChatProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const initial =
    userName && userName.trim().length > 0 ? userName.trim().charAt(0).toUpperCase() : '?';

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

        <TouchableOpacity
          className="flex-row items-center flex-1"
          activeOpacity={companyId ? 0.7 : 1}
          disabled={!companyId}
          onPress={() => companyId && router.push(`/company/${companyId}` as never)}
        >
          <View className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden mr-3">
            {userImage ? (
              <Image source={{ uri: userImage }} className="flex-1" />
            ) : (
              <View className="flex-1 items-center justify-center bg-primary-100">
                <Text className="text-primary-600 font-bold">{initial}</Text>
              </View>
            )}
          </View>

          <View className="flex-1">
            <Text
              className="font-bold text-[16px] text-neutral-900 dark:text-white"
              numberOfLines={1}
            >
              {userName || 'Entreprise'}
            </Text>
            {publicationTitle ? (
              <View className="flex-row items-center">
                <Text
                  className="text-[10px] text-primary-disabled uppercase font-bold tracking-tight"
                  numberOfLines={1}
                >
                  {publicationTitle}
                </Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="p-2">
        <Ionicons name="ellipsis-vertical" size={20} color={colors.primary.disabled} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderChat;
