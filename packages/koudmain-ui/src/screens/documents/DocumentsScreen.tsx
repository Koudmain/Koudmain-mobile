import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../constants/theme';
import { DocumentCategory, FolderDisplayMode, FolderType, RootViewMode } from './types';
import { INITIAL_DOCUMENTS } from './mockData';
import { DocumentThumbnail } from './DocumentThumbnail';

interface DocumentsScreenProps {
  onBack?: () => void;
  initialViewMode?: RootViewMode;
  initialFolder?: FolderType | null;
}

export function DocumentsScreen({
  onBack,
  initialViewMode = 'list',
  initialFolder = null,
}: DocumentsScreenProps) {
  const [rootViewMode, setRootViewMode] = useState<RootViewMode>(initialViewMode);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(initialFolder);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [folderDisplayMode, setFolderDisplayMode] = useState<FolderDisplayMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

  const filteredDocuments = useMemo(() => {
    let docs = INITIAL_DOCUMENTS;

    if (selectedFolder) {
      docs = docs.filter((doc) => doc.folder === selectedFolder);
    }

    if (selectedCategory) {
      docs = docs.filter((doc) => doc.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      docs = docs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          (doc.shortTitle && doc.shortTitle.toLowerCase().includes(q)) ||
          doc.date.includes(q),
      );
    }

    return docs;
  }, [selectedFolder, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    return {
      pdf: INITIAL_DOCUMENTS.filter((d) => d.category === 'pdf').length,
      image: INITIAL_DOCUMENTS.filter((d) => d.category === 'image').length,
      other: INITIAL_DOCUMENTS.filter((d) => d.category === 'other').length,
    };
  }, []);

  const recentDocuments = useMemo(() => {
    return INITIAL_DOCUMENTS.slice(0, 5);
  }, []);

  const handleBack = () => {
    if (selectedFolder !== null) {
      setSelectedFolder(null);
      return;
    }
    if (selectedCategory !== null) {
      setSelectedCategory(null);
      return;
    }
    onBack?.();
  };

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-neutral-800"
        >
          <Feather name="chevron-left" size={24} color={colors.secondary.DEFAULT} />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center justify-center -ml-2">
          {selectedFolder && (
            <Feather
              name="folder"
              size={18}
              color={colors.secondary.DEFAULT}
              style={{ marginRight: 6 }}
            />
          )}
          <Text className="text-base font-semibold text-neutral-900 dark:text-white">
            {selectedFolder ? selectedFolder : 'Documents'}
          </Text>
        </View>

        <View className="w-10" />
      </View>

      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center bg-[#F3F4F6] dark:bg-[#38383B] rounded-xl px-3 h-10">
          <Feather name="search" size={16} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher un document..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-sm text-neutral-900 dark:text-white py-0"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {selectedFolder ? (
        <View className="flex-1">
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

          <Modal
            transparent
            visible={isViewMenuOpen}
            animationType="fade"
            onRequestClose={() => setIsViewMenuOpen(false)}
          >
            <TouchableWithoutFeedback onPress={() => setIsViewMenuOpen(false)}>
              <View className="flex-1 bg-black/10">
                <View className="absolute right-4 top-32 w-14 bg-white dark:bg-[#2C2C2E] rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 py-1 items-center">
                  <TouchableOpacity
                    onPress={() => {
                      setFolderDisplayMode('grid');
                      setIsViewMenuOpen(false);
                    }}
                    className={`w-full py-2.5 items-center justify-center ${
                      folderDisplayMode === 'grid' ? 'bg-gray-100 dark:bg-neutral-700' : ''
                    }`}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={18}
                      color={folderDisplayMode === 'grid' ? colors.secondary.DEFAULT : '#8E8E93'}
                    />
                  </TouchableOpacity>

                  <View className="h-px w-4/5 bg-gray-200 dark:bg-neutral-700 my-0.5" />
                  <TouchableOpacity
                    onPress={() => {
                      setFolderDisplayMode('list');
                      setIsViewMenuOpen(false);
                    }}
                    className={`w-full py-2.5 items-center justify-center ${
                      folderDisplayMode === 'list' ? 'bg-gray-100 dark:bg-neutral-700' : ''
                    }`}
                  >
                    <Feather
                      name="list"
                      size={18}
                      color={folderDisplayMode === 'list' ? colors.secondary.DEFAULT : '#8E8E93'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          {folderDisplayMode === 'grid' ? (
            <FlatList
              data={filteredDocuments}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
              columnWrapperStyle={{ justifyContent: 'flex-start', gap: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.7} className="w-[30%] mb-3 items-center">
                  <View className="w-full aspect-[4/5] rounded-2xl bg-gray-50 dark:bg-[#2C2C2E] border border-gray-100 dark:border-neutral-800 items-center justify-center p-2 mb-1.5 shadow-2xs">
                    <DocumentThumbnail type={item.thumbnailType} size="md" />
                  </View>
                  <Text
                    numberOfLines={2}
                    className="text-[11px] font-medium text-center text-neutral-800 dark:text-neutral-200"
                  >
                    {item.shortTitle || item.title}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="py-12 items-center justify-center">
                  <Text className="text-sm text-neutral-400">Aucun document trouvé</Text>
                </View>
              }
            />
          ) : (
            <FlatList
              data={filteredDocuments}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-100 dark:bg-neutral-800 my-1" />
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between py-3"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-medium text-neutral-900 dark:text-white leading-snug">
                      {item.title}
                    </Text>
                    <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      {item.date}
                    </Text>
                  </View>
                  <DocumentThumbnail type={item.thumbnailType} size="sm" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="py-12 items-center justify-center">
                  <Text className="text-sm text-neutral-400">Aucun document trouvé</Text>
                </View>
              }
            />
          )}
        </View>
      ) : (
        <View className="flex-1">
          <View className="px-4 py-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setRootViewMode(rootViewMode === 'list' ? 'folders' : 'list')}
              className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-[#38383B] shadow-2xs"
            >
              <View className="flex-row items-center">
                {rootViewMode === 'list' ? (
                  <>
                    <Feather
                      name="folder"
                      size={18}
                      color={colors.secondary.DEFAULT}
                      style={{ marginRight: 10 }}
                    />
                    <Text className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Folders
                    </Text>
                  </>
                ) : (
                  <>
                    <Feather
                      name="list"
                      size={18}
                      color={colors.secondary.DEFAULT}
                      style={{ marginRight: 10 }}
                    />
                    <Text className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Listes
                    </Text>
                  </>
                )}
              </View>
              <Feather name="chevron-right" size={18} color="#D84A22" />
            </TouchableOpacity>
          </View>

          {rootViewMode === 'list' ? (
            <View className="flex-1">
              <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
                <Text className="text-xs font-medium text-neutral-400 dark:text-neutral-400">
                  Documents
                </Text>
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="w-6 h-6 rounded-full items-center justify-center border border-[#D84A22]"
                >
                  <Ionicons name="refresh-outline" size={12} color={colors.secondary.DEFAULT} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={filteredDocuments}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                ItemSeparatorComponent={() => (
                  <View className="h-px bg-gray-100 dark:bg-neutral-800 my-1" />
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between py-3"
                  >
                    <View className="flex-1 pr-3">
                      <Text className="text-sm font-medium text-neutral-900 dark:text-white leading-snug">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                        {item.date}
                      </Text>
                    </View>
                    <DocumentThumbnail type={item.thumbnailType} size="sm" />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="py-12 items-center justify-center">
                    <Text className="text-sm text-neutral-400">Aucun document trouvé</Text>
                  </View>
                }
              />
            </View>
          ) : (
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-row gap-3 my-3">
                {(['Contrats', 'Factures', 'Personnel'] as FolderType[]).map((folder) => (
                  <TouchableOpacity
                    key={folder}
                    activeOpacity={0.8}
                    onPress={() => setSelectedFolder(folder)}
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

              <View className="mt-4">
                <Text className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
                  Récents
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10 }}
                >
                  {recentDocuments.map((doc) => (
                    <TouchableOpacity
                      key={doc.id}
                      activeOpacity={0.7}
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

              <View className="mt-6">
                <Text className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
                  Fichiers
                </Text>

                <View className="gap-2">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSelectedCategory(selectedCategory === 'pdf' ? null : 'pdf')}
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
                    <Text className="text-xs font-semibold text-neutral-400">
                      {categoryCounts.pdf}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      setSelectedCategory(selectedCategory === 'image' ? null : 'image')
                    }
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
                      <Text className="text-sm font-medium text-neutral-900 dark:text-white">
                        Images
                      </Text>
                    </View>
                    <Text className="text-xs font-semibold text-neutral-400">
                      {categoryCounts.image}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      setSelectedCategory(selectedCategory === 'other' ? null : 'other')
                    }
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
                      <Text className="text-sm font-medium text-neutral-900 dark:text-white">
                        Autres
                      </Text>
                    </View>
                    <Text className="text-xs font-semibold text-neutral-400">
                      {categoryCounts.other}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
