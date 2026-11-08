import React from 'react';
import { View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { ThumbnailType } from './types';

interface DocumentThumbnailProps {
  type?: ThumbnailType;
  size?: 'sm' | 'md' | 'lg';
}

export function DocumentThumbnail({ type = 'pdf', size = 'sm' }: DocumentThumbnailProps) {
  const isCni = type === 'cni';
  const isImage = type === 'image';

  const dims = {
    sm: { width: 30, height: 38, lineH: 1.5, gap: 2 },
    md: { width: 48, height: 60, lineH: 2, gap: 3 },
    lg: { width: 56, height: 72, lineH: 2.5, gap: 4 },
  }[size];

  if (isCni) {
    return (
      <View
        style={{ width: dims.width * 1.25, height: dims.height * 0.8 }}
        className="rounded-sm bg-[#E6F0FA] dark:bg-[#1E293B] border border-[#BFDBFE] dark:border-[#334155] p-1 justify-between shadow-xs overflow-hidden"
      >
        <View className="flex-row items-center justify-between pb-0.5 border-b border-[#BFDBFE] dark:border-[#334155]">
          <View className="flex-row">
            <View className="w-1 h-1 bg-[#1E3A8A]" />
            <View className="w-1 h-1 bg-white" />
            <View className="w-1 h-1 bg-[#DC2626]" />
          </View>
          <View className="h-0.5 w-6 bg-[#93C5FD] dark:bg-[#475569] rounded-full" />
        </View>

        <View className="flex-row justify-between items-center mt-0.5">
          <View className="flex-1 pr-1 gap-0.5">
            <View className="h-0.5 w-full bg-[#93C5FD] dark:bg-[#475569] rounded-full" />
            <View className="h-0.5 w-3/4 bg-[#93C5FD] dark:bg-[#475569] rounded-full" />
            <View className="h-0.5 w-1/2 bg-[#93C5FD] dark:bg-[#475569] rounded-full" />
          </View>
          <View className="w-3 h-4 bg-[#93C5FD] dark:bg-[#475569] rounded-xs items-center justify-center">
            <Feather name="user" size={7} color="#1E3A8A" />
          </View>
        </View>
      </View>
    );
  }

  if (isImage) {
    return (
      <View
        style={{ width: dims.width, height: dims.height }}
        className="rounded-sm bg-[#FEF3C7] dark:bg-[#3D2E14] border border-[#FDE68A] dark:border-[#78350F] items-center justify-center p-1 shadow-xs"
      >
        <Feather name="image" size={size === 'sm' ? 12 : 20} color="#D97706" />
      </View>
    );
  }

  return (
    <View
      style={{ width: dims.width, height: dims.height }}
      className="rounded-sm bg-white dark:bg-[#2F2F32] border border-gray-200 dark:border-neutral-600 p-1 justify-between shadow-xs overflow-hidden"
    >
      <View className="flex-row items-center gap-1 mb-0.5">
        <View className="w-1.5 h-1.5 rounded-xs bg-[#D84A22]" />
        <View className="h-0.5 flex-1 bg-gray-400 dark:bg-neutral-500 rounded-full" />
      </View>

      <View style={{ gap: dims.gap }} className="flex-1 justify-center">
        <View className="h-0.5 w-full bg-gray-300 dark:bg-neutral-500 rounded-full" />
        <View className="h-0.5 w-5/6 bg-gray-300 dark:bg-neutral-500 rounded-full" />
        <View className="h-0.5 w-full bg-gray-300 dark:bg-neutral-500 rounded-full" />
        <View className="h-0.5 w-2/3 bg-gray-300 dark:bg-neutral-500 rounded-full" />
        {size !== 'sm' && (
          <>
            <View className="h-0.5 w-4/5 bg-gray-300 dark:bg-neutral-500 rounded-full" />
            <View className="h-0.5 w-3/4 bg-gray-300 dark:bg-neutral-500 rounded-full" />
          </>
        )}
      </View>

      <View className="flex-row justify-end mt-0.5">
        <View className="h-0.5 w-2.5 bg-[#D84A22]/70 rounded-full" />
      </View>
    </View>
  );
}
