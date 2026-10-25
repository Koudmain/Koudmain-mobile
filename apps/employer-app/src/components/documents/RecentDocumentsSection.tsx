import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@koudmain/ui/gluestack';
import { RECENT_DOCUMENTS, type FakeDocument } from '@/constants/fakeDocuments';
import { RecentDocumentCard } from './RecentDocumentCard';

interface Props {
  onDocumentPress?: (doc: FakeDocument) => void;
}

/**
 * The "Récents" section: a label followed by a horizontal scrollable list
 * of the 5 most recently modified documents.
 */
export function RecentDocumentsSection({ onDocumentPress }: Props) {
  return (
    <View className="mb-4">
      <Text className="text-primary dark:text-white font-semibold text-base px-4 mb-3">
        Récents
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {RECENT_DOCUMENTS.map((doc) => (
          <RecentDocumentCard key={doc.id} document={doc} onPress={onDocumentPress} />
        ))}
      </ScrollView>
    </View>
  );
}
