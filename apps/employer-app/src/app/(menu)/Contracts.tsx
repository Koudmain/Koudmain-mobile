import React, { useState, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import type { DocumentCategory, FakeDocument } from '@/constants/fakeDocuments';
import { getDocumentsByCategory } from '@/constants/fakeDocuments';
import { DocumentsHeader } from '@/components/documents/DocumentsHeader';
import { DocumentsSearchBar } from '@/components/documents/DocumentsSearchBar';
import { FolderSection } from '@/components/documents/FolderSection';
import { RecentDocumentsSection } from '@/components/documents/RecentDocumentsSection';
import { DocumentsListView } from '@/components/documents/DocumentsListView';
import { DocumentsGridView } from '@/components/documents/DocumentsGridView';

type ViewMode = 'list' | 'grid';

export default function ContractsScreen() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filteredDocuments = useMemo(() => {
    const base = getDocumentsByCategory(activeCategory);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      (d) => d.title.toLowerCase().includes(q) || d.workerName.toLowerCase().includes(q),
    );
  }, [activeCategory, query]);

  const handleDocumentPress = (doc: FakeDocument) => {
    // TODO: open document viewer / detail screen
  };

  const toggleViewMode = () => setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'));

  const showRecents = !activeCategory && !query.trim();

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <DocumentsHeader
        activeCategory={activeCategory}
        viewMode={viewMode}
        onToggleView={toggleViewMode}
      />

      <DocumentsSearchBar value={query} onChangeText={setQuery} onClear={() => setQuery('')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <FolderSection activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

        {showRecents && <RecentDocumentsSection onDocumentPress={handleDocumentPress} />}

        <View className="mt-2">
          {viewMode === 'list' ? (
            <DocumentsListView
              documents={filteredDocuments}
              onDocumentPress={handleDocumentPress}
            />
          ) : (
            <DocumentsGridView
              documents={filteredDocuments}
              onDocumentPress={handleDocumentPress}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
