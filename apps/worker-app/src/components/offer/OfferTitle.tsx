import React from 'react';
import { View, Text } from 'react-native';
import { PublicationStatus } from '@/types/publication';

interface OfferTitleProps {
  title: string;
  status?: PublicationStatus | string;
  isAvailable?: boolean;
}

const STATUS_BADGE_STYLES: Record<string, { bgClass: string; label: string }> = {
  [PublicationStatus.OPEN]: {
    bgClass: 'bg-success',
    label: PublicationStatus.OPEN,
  },
  [PublicationStatus.URGENT]: {
    bgClass: 'bg-warning',
    label: PublicationStatus.URGENT,
  },
  [PublicationStatus.CLOSE]: {
    bgClass: 'bg-error',
    label: PublicationStatus.CLOSE,
  },
};

export function OfferTitle({ title, status, isAvailable = true }: OfferTitleProps) {
  const resolvedStatus = status ?? (isAvailable ? PublicationStatus.OPEN : PublicationStatus.CLOSE);
  const badge = STATUS_BADGE_STYLES[resolvedStatus] ?? {
    bgClass: isAvailable ? 'bg-success' : 'bg-error',
    label: String(resolvedStatus),
  };

  return (
    <View className="flex-row items-center justify-between px-6 mb-6">
      <Text className="text-3xl font-bold text-primary dark:text-primary-content max-w-[70%]">
        {title}
      </Text>
      <View className={`${badge.bgClass} px-3 py-1.5 rounded-lg`}>
        <Text className="text-primary-content font-bold text-md">{badge.label}</Text>
      </View>
    </View>
  );
}
