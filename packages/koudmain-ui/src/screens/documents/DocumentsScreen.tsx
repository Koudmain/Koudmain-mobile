import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Alert, Linking } from 'react-native';
import {
  DocumentCategory,
  DocumentItem,
  FolderDisplayMode,
  FolderType,
  RootViewMode,
  mapApiDocumentToItem,
} from './types';
import { useSession } from '../../context/SessionContext';
import { ApiDocument, documentService } from '../../api/document.api';
import {
  DocumentHeader,
  DocumentSearchBar,
  FolderDetailView,
  RootListView,
  RootFoldersView,
} from './components';

interface DocumentsScreenProps {
  onBack?: () => void;
  initialViewMode?: RootViewMode;
  initialFolder?: FolderType | null;
  companyId?: number | null;
  scope?: 'auto' | 'user' | 'worker' | 'company';
}

export function DocumentsScreen({
  onBack,
  initialViewMode = 'list',
  initialFolder = null,
  companyId = null,
  scope = 'auto',
}: DocumentsScreenProps) {
  const { session, user } = useSession();

  const [rootViewMode, setRootViewMode] = useState<RootViewMode>(initialViewMode);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(initialFolder);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [folderDisplayMode, setFolderDisplayMode] = useState<FolderDisplayMode>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Backend state
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);

  /**
   * Fetch documents from backend based on user role and context
   */
  const loadDocuments = useCallback(
    async (isPullToRefresh = false) => {
      if (!session) {
        setIsLoading(false);
        setDocuments([]);
        return;
      }

      if (isPullToRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        let rawDocs: ApiDocument[] = [];

        if (scope === 'company' || (scope === 'auto' && companyId != null)) {
          if (companyId != null) {
            rawDocs = await documentService.getCompanyDocuments(session, companyId);
          }
        } else if (scope === 'worker' || (scope === 'auto' && user?.role === 'WORKER')) {
          const [workerRes, userRes] = await Promise.allSettled([
            documentService.getWorkerDocuments(session),
            documentService.getUserDocuments(session),
          ]);

          const workerDocs = workerRes.status === 'fulfilled' ? workerRes.value : [];
          const userDocs = userRes.status === 'fulfilled' ? userRes.value : [];

          // Merge by unique id
          const docMap = new Map<number, ApiDocument>();
          workerDocs.forEach((d) => docMap.set(d.id, d));
          userDocs.forEach((d) => docMap.set(d.id, d));
          rawDocs = Array.from(docMap.values());
        } else {
          rawDocs = await documentService.getUserDocuments(session);
        }

        if (Array.isArray(rawDocs)) {
          const mapped = rawDocs.map(mapApiDocumentToItem);
          setDocuments(mapped);
        }
      } catch (err) {
        console.warn('Erreur chargement documents depuis API:', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [session, scope, companyId, user?.role],
  );

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  /**
   * Open / Download Document using presigned URL
   */
  const handleDocumentPress = async (doc: DocumentItem) => {
    if (openingDocId) return;

    if (doc.raw?.id && session) {
      setOpeningDocId(doc.id);
      try {
        const res = await documentService.getDownloadUrl(session, doc.raw.id);
        if (res?.url) {
          await Linking.openURL(res.url);
        } else {
          Alert.alert('Erreur', 'Lien de téléchargement introuvable.');
        }
      } catch (err) {
        console.error('Erreur téléchargement document:', err);
        Alert.alert('Document indisponible', "Impossible d'ouvrir ou télécharger ce document.");
      } finally {
        setOpeningDocId(null);
      }
    } else if (doc.fileUri) {
      Linking.openURL(doc.fileUri).catch(() => {
        Alert.alert('Document indisponible', "Ce document n'a pas pu être ouvert.");
      });
    } else {
      Alert.alert(
        doc.title,
        `Date: ${doc.date}\nCatégorie: ${doc.folder}\nFormat: ${doc.category.toUpperCase()}`,
      );
    }
  };

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    let docs = documents;

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
  }, [documents, selectedFolder, selectedCategory, searchQuery]);

  // Counts for categories
  const categoryCounts = useMemo(() => {
    return {
      pdf: documents.filter((d) => d.category === 'pdf').length,
      image: documents.filter((d) => d.category === 'image').length,
      other: documents.filter((d) => d.category === 'other').length,
    };
  }, [documents]);

  // Recent documents (first 5)
  const recentDocuments = useMemo(() => {
    return documents.slice(0, 5);
  }, [documents]);

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
      {/* HEADER */}
      <DocumentHeader selectedFolder={selectedFolder} onBack={handleBack} />

      {/* SEARCH BAR */}
      <DocumentSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* CONTENT */}
      {selectedFolder ? (
        <FolderDetailView
          selectedFolder={selectedFolder}
          documents={filteredDocuments}
          folderDisplayMode={folderDisplayMode}
          onChangeDisplayMode={setFolderDisplayMode}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={() => loadDocuments(true)}
          openingDocId={openingDocId}
          onDocumentPress={handleDocumentPress}
        />
      ) : rootViewMode === 'list' ? (
        <RootListView
          documents={filteredDocuments}
          onSwitchToFolders={() => setRootViewMode('folders')}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={() => loadDocuments(true)}
          openingDocId={openingDocId}
          onDocumentPress={handleDocumentPress}
        />
      ) : (
        <RootFoldersView
          onSwitchToList={() => setRootViewMode('list')}
          onSelectFolder={(folder) => setSelectedFolder(folder)}
          recentDocuments={recentDocuments}
          categoryCounts={categoryCounts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isRefreshing={isRefreshing}
          onRefresh={() => loadDocuments(true)}
          onDocumentPress={handleDocumentPress}
        />
      )}
    </View>
  );
}
