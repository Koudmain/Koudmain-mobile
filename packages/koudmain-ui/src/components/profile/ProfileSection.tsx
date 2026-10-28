import React from 'react';
import { Text, View } from 'react-native';
import { cnFusion } from '../../utils/cnFusion';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ProfileSection({ title, children, className }: ProfileSectionProps) {
  return (
    <View className={cnFusion('mt-6', className)}>
      <Text className="text-lg font-semibold text-primary dark:text-white mb-3">{title}</Text>
      {children}
    </View>
  );
}
