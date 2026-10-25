import React from 'react';
import { View } from 'react-native';
import { Text } from '@koudmain/ui/gluestack';
import type { FakeDocument } from '@/constants/fakeDocuments';
import { DocumentListItem } from './DocumentListItem';

interface Props {
  documents: FakeDocument[];
  onDocumentPress?: (doc: FakeDocument) => void;
}

/**
 * Renders the full list of documents grouped by a divider.
 * Uses DocumentListItem for each row.
 */
export function DocumentsListView({ documents, onDocumentPress }: Props) {
  if (documents.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <Text className="text-primary-disabled text-sm">Aucun document trouvé</Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-primary dark:text-white font-semibold text-base px-4 mb-2">
        Fichiers
      </Text>

      {documents.map((doc, index) => (
        <View key={doc.id}>
          <DocumentListItem document={doc} onPress={onDocumentPress} />
          {index < documents.length - 1 && (
            <View className="h-px bg-secondary-50 dark:bg-primary-hover mx-4" />
          )}
        </View>
      ))}
    </View>
  );
}
