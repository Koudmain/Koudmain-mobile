import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../../constants/theme';
import { DocumentItem } from '../types';
import { DocumentListItem } from './DocumentListItem';

interface RootListViewProps {
  documents: DocumentItem[];
  onSwitchToFolders: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  openingDocId: string | null;
  onDocumentPress: (doc: DocumentItem) => void;
}

export function RootListView({
  documents,
  onSwitchToFolders,
  isLoading,
  isRefreshing,
  onRefresh,
  openingDocId,
  onDocumentPress,
}: RootListViewProps) {
  return (
    <View className="flex-1">
      <View className="px-4 py-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSwitchToFolders}
          className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-[#38383B] shadow-2xs"
        >
          <View className="flex-row items-center">
            <Feather
              name="folder"
              size={18}
              color={colors.secondary.DEFAULT}
              style={{ marginRight: 10 }}
            />
            <Text className="text-sm font-semibold text-neutral-900 dark:text-white">Folders</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#D84A22" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
        <Text className="text-xs font-medium text-neutral-400 dark:text-neutral-400">
          Documents
        </Text>
        <TouchableOpacity
          onPress={onRefresh}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-6 h-6 rounded-full items-center justify-center border border-[#D84A22] active:opacity-60"
        >
          <Ionicons name="refresh-outline" size={12} color={colors.secondary.DEFAULT} />
        </TouchableOpacity>
      </View>

      {isLoading && documents.length === 0 ? (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color={colors.secondary.DEFAULT} />
          <Text className="text-xs text-neutral-400 mt-2">Chargement des documents...</Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.secondary.DEFAULT}
              colors={[colors.secondary.DEFAULT]}
            />
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-100 dark:bg-neutral-800 my-1" />
          )}
          renderItem={({ item }) => (
            <DocumentListItem
              item={item}
              isOpening={openingDocId === item.id}
              onPress={onDocumentPress}
            />
          )}
          ListEmptyComponent={
            <View className="py-12 items-center justify-center">
              <Text className="text-sm text-neutral-400">Aucun document trouvé</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
