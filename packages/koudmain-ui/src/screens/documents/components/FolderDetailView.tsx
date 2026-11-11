import React, { useState } from 'react';
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
import { DocumentItem, FolderDisplayMode, FolderType } from '../types';
import { DocumentListItem } from './DocumentListItem';
import { DocumentGridItem } from './DocumentGridItem';
import { ViewModePopover } from './ViewModePopover';

interface FolderDetailViewProps {
  selectedFolder: FolderType;
  documents: DocumentItem[];
  folderDisplayMode: FolderDisplayMode;
  onChangeDisplayMode: (mode: FolderDisplayMode) => void;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  openingDocId: string | null;
  onDocumentPress: (doc: DocumentItem) => void;
}

export function FolderDetailView({
  selectedFolder,
  documents,
  folderDisplayMode,
  onChangeDisplayMode,
  isLoading,
  isRefreshing,
  onRefresh,
  openingDocId,
  onDocumentPress,
}: FolderDetailViewProps) {
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

  return (
    <View className="flex-1">
      {/* Subheader with View Toggle */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-xs font-medium text-neutral-400 dark:text-neutral-400">
          {selectedFolder}
        </Text>

        <TouchableOpacity
          onPress={() => setIsViewMenuOpen(!isViewMenuOpen)}
          className="w-8 h-8 rounded-full items-center justify-center border border-[#D84A22] dark:border-[#D84A22] active:opacity-70"
        >
          {folderDisplayMode === 'grid' ? (
            <Ionicons name="grid-outline" size={16} color={colors.secondary.DEFAULT} />
          ) : (
            <Feather name="list" size={16} color={colors.secondary.DEFAULT} />
          )}
        </TouchableOpacity>
      </View>

      {/* Popover */}
      <ViewModePopover
        visible={isViewMenuOpen}
        currentMode={folderDisplayMode}
        onSelectMode={onChangeDisplayMode}
        onClose={() => setIsViewMenuOpen(false)}
      />

      {/* Content */}
      {isLoading && documents.length === 0 ? (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color={colors.secondary.DEFAULT} />
          <Text className="text-xs text-neutral-400 mt-2">Chargement...</Text>
        </View>
      ) : folderDisplayMode === 'grid' ? (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          numColumns={3}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.secondary.DEFAULT}
              colors={[colors.secondary.DEFAULT]}
            />
          }
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
          columnWrapperStyle={{ justifyContent: 'flex-start', gap: 10 }}
          renderItem={({ item }) => (
            <DocumentGridItem
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
