import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../../constants/theme';
import { DocumentCategory, DocumentItem, FolderType } from '../types';
import { DocumentThumbnail } from '../DocumentThumbnail';

interface RootFoldersViewProps {
  onSwitchToList: () => void;
  onSelectFolder: (folder: FolderType) => void;
  recentDocuments: DocumentItem[];
  categoryCounts: { pdf: number; image: number; other: number };
  selectedCategory: DocumentCategory | null;
  onSelectCategory: (cat: DocumentCategory | null) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onDocumentPress: (doc: DocumentItem) => void;
}

export function RootFoldersView({
  onSwitchToList,
  onSelectFolder,
  recentDocuments,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
  isRefreshing,
  onRefresh,
  onDocumentPress,
}: RootFoldersViewProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.secondary.DEFAULT}
          colors={[colors.secondary.DEFAULT]}
        />
      }
    >
      {/* Switcher Card Button */}
      <View className="py-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSwitchToList}
          className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-[#38383B] shadow-2xs"
        >
          <View className="flex-row items-center">
            <Feather
              name="list"
              size={18}
              color={colors.secondary.DEFAULT}
              style={{ marginRight: 10 }}
            />
            <Text className="text-sm font-semibold text-neutral-900 dark:text-white">Listes</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#D84A22" />
        </TouchableOpacity>
      </View>

      {/* 3 Folders Row */}
      <View className="flex-row gap-3 my-3">
        {(['Contrats', 'Factures', 'Personnel'] as FolderType[]).map((folder) => (
          <TouchableOpacity
            key={folder}
            activeOpacity={0.8}
            onPress={() => onSelectFolder(folder)}
            className="flex-1 aspect-[1.1] rounded-2xl bg-gray-50 dark:bg-[#38383B] border border-gray-100 dark:border-neutral-800 p-3 items-center justify-center shadow-2xs"
          >
            <View className="w-10 h-10 rounded-full items-center justify-center bg-transparent mb-1">
              <MaterialIcons name="folder" size={32} color={colors.secondary.DEFAULT} />
            </View>
            <Text className="text-xs font-semibold text-neutral-900 dark:text-white mt-1">
              {folder}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SECTION: RÉCENTS */}
      {recentDocuments.length > 0 && (
        <View className="mt-4">
          <Text className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Récents</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {recentDocuments.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                activeOpacity={0.7}
                onPress={() => onDocumentPress(doc)}
                className="w-20 items-center"
              >
                <View className="w-20 h-24 rounded-2xl bg-gray-50 dark:bg-[#38383B] border border-gray-100 dark:border-neutral-800 items-center justify-center p-2 mb-1.5 shadow-2xs">
                  <DocumentThumbnail type={doc.thumbnailType} size="md" />
                </View>
                <Text
                  numberOfLines={2}
                  className="text-[10px] font-medium text-center text-neutral-700 dark:text-neutral-300"
                >
                  {doc.shortTitle || doc.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* SECTION: FICHIERS */}
      <View className="mt-6">
        <Text className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Fichiers</Text>

        <View className="gap-2">
          {/* Category: PDF */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSelectCategory(selectedCategory === 'pdf' ? null : 'pdf')}
            className={`flex-row items-center justify-between p-3 rounded-2xl border ${
              selectedCategory === 'pdf'
                ? 'border-[#D84A22] bg-[#D84A22]/5'
                : 'border-transparent bg-transparent'
            }`}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-[#E02424] items-center justify-center mr-3">
                <Text className="text-[10px] font-black text-white">PDF</Text>
              </View>
              <Text className="text-sm font-medium text-neutral-900 dark:text-white">
                Documents PDF
              </Text>
            </View>
            <Text className="text-xs font-semibold text-neutral-400">{categoryCounts.pdf}</Text>
          </TouchableOpacity>

          {/* Category: Images */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSelectCategory(selectedCategory === 'image' ? null : 'image')}
            className={`flex-row items-center justify-between p-3 rounded-2xl border ${
              selectedCategory === 'image'
                ? 'border-[#D84A22] bg-[#D84A22]/5'
                : 'border-transparent bg-transparent'
            }`}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-[#F59E0B] items-center justify-center mr-3">
                <Feather name="image" size={16} color="white" />
              </View>
              <Text className="text-sm font-medium text-neutral-900 dark:text-white">Images</Text>
            </View>
            <Text className="text-xs font-semibold text-neutral-400">{categoryCounts.image}</Text>
          </TouchableOpacity>

          {/* Category: Autres */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSelectCategory(selectedCategory === 'other' ? null : 'other')}
            className={`flex-row items-center justify-between p-3 rounded-2xl border ${
              selectedCategory === 'other'
                ? 'border-[#D84A22] bg-[#D84A22]/5'
                : 'border-transparent bg-transparent'
            }`}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-[#EA580C] items-center justify-center mr-3">
                <Feather name="file" size={16} color="white" />
              </View>
              <Text className="text-sm font-medium text-neutral-900 dark:text-white">Autres</Text>
            </View>
            <Text className="text-xs font-semibold text-neutral-400">{categoryCounts.other}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
