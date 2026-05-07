import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { router } from 'expo-router';

interface OfferHeaderProps {
  title: string;
  imageSource: any;
  logoSource?: any;
}

export function OfferHeader({ title, imageSource, logoSource }: OfferHeaderProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <View className="relative w-full h-[250px] mb-4 bg-white dark:bg-primary">
      <Image source={imageSource} className="w-full h-full rounded-b-[20]" resizeMode="cover" />

      <View className="absolute inset-0 bg-black/40 rounded-[20]" />

      <View className="absolute left-0 right-0 mt-4 px-6 flex-row justify-between items-center z-10">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <Feather name="arrow-left" size={28} color={colors?.primary.content} />
        </Pressable>
        <Pressable
          onPress={() => {
            setIsFavorite(!isFavorite);
          }}
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <FontAwesome6
            name="heart"
            size={28}
            color={isFavorite ? 'red' : colors?.primary.content}
            solid={isFavorite}
          />
        </Pressable>
      </View>

      <View className="absolute bottom-16 left-1/2 -translate-x-1/2 -translate-y-[20px] w-[90px] h-[90px] bg-white rounded-full items-center justify-center shadow-lg border-2 border-white z-20">
        {logoSource ? (
          <Image source={logoSource} className="w-full h-full rounded-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full bg-gray-200 rounded-full items-center justify-center">
            <FontAwesome6 name="hat-chef" size={32} color={colors?.primary.DEFAULT} />
          </View>
        )}
      </View>
      <View className="absolute bottom-6 left-0 right-0 px-6 z-10 items-center">
        <Text className="text-white text-3xl font-bold text-center">{title}</Text>
      </View>
    </View>
  );
}
