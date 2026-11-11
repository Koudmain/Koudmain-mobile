import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

interface DocumentSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function DocumentSearchBar({ value, onChangeText }: DocumentSearchBarProps) {
  return (
    <View className="px-4 pt-3 pb-2">
      <View className="flex-row items-center bg-[#F3F4F6] dark:bg-[#38383B] rounded-xl px-3 h-10">
        <Feather name="search" size={16} color="#9CA3AF" />
        <TextInput
          placeholder="Rechercher un document..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          className="flex-1 ml-2 text-sm text-neutral-900 dark:text-white py-0"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Feather name="x" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
