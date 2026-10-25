import React from 'react';
import { View } from 'react-native';
import { Text } from '@koudmain/ui/gluestack';
import type { FakeDocument } from '@/constants/fakeDocuments';
import { DocumentGridItem } from './DocumentGridItem';

interface Props {
  documents: FakeDocument[];
  onDocumentPress?: (doc: FakeDocument) => void;
}

/**
 * Renders documents as a responsive multi-column grid.
 * Uses DocumentGridItem for each card.
 */
export function DocumentsGridView({ documents, onDocumentPress }: Props) {
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

      <View className="flex-row flex-wrap px-2">
        {documents.map((doc) => (
          <DocumentGridItem key={doc.id} document={doc} onPress={onDocumentPress} />
        ))}
      </View>
    </View>
  );
}
