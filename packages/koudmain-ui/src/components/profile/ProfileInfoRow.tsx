import React from 'react';
import { Text, View } from 'react-native';

interface ProfileInfoRowProps {
  icon: React.ReactNode;
  text: string;
  subtext?: string | null;
}

export default function ProfileInfoRow({ icon, text, subtext }: ProfileInfoRowProps) {
  return (
    <View className="flex-row items-center mb-3">
      <View className="w-8 items-center mr-3">{icon}</View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-primary dark:text-white">{text}</Text>
        {subtext ? (
          <Text className="text-xs text-primary-600 dark:text-primary-300">{subtext}</Text>
        ) : null}
      </View>
    </View>
  );
}
