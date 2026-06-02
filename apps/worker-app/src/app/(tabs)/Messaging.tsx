import { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionList, Text, View, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import SearchBar from '@/components/tools/SearchBar';
import { normalizeText } from '@koudmain/ui/utils/text';
import { ConversationItem } from '@koudmain/ui/components/messaging/ConversationItem';
import { SectionHeader } from '@koudmain/ui/components/messaging/SectionsHeader';
import { useSession } from '@/context/SessionContext';
import { IConversation } from '@koudmain/ui';

export default function Messaging() {
  const [searchText, setSearchText] = useState('');
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [selectedPubId, setSelectedPubId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);

  const { session } = useSession();

  useFocusEffect(
    useCallback(() => {
      return () => setOpenRowId(null);
    }, []),
  );

  useEffect(() => {
    if (session) {
      console.log('Fetching conversations for worker with session:', session);
    }
  }, [session]);

  const closeAll = () => {
    setOpenRowId(null);
  };

  const handlePin = (id: number) => {
    const convIndex = conversations.findIndex((c) => c.id === id);
    if (convIndex !== -1) {
      conversations[convIndex].settings.is_pinned = !conversations[convIndex].settings.is_pinned;
      setOpenRowId(null);
    }
  };

  const sections = useMemo(() => {
    const cleanQuery = normalizeText(searchText.trim());
    const tokens = cleanQuery.length > 0 ? cleanQuery.split(/\s+/) : [];
    const filtered = conversations.filter((conv) => {
      if (selectedPubId && conv.publication_id !== selectedPubId) {
        return false;
      }

      const searchableText = normalizeText(`${conv.last_message[0]?.content_text}`);
      return tokens.every((token) => searchableText.includes(token));
    });

    const pinned = filtered.filter((c) => c.settings.is_pinned);
    const others = filtered.filter((c) => !c.settings.is_pinned);

    const result = [];
    if (pinned.length > 0) {
      result.push({ title: 'Messages épinglés', data: pinned, icon: 'pin' });
      result.push({ title: 'Tous les messages', data: others, icon: 'wechat' });
    } else {
      result.push({ title: '', data: others, icon: '' });
    }
    return result;
  }, [searchText, conversations, selectedPubId]);

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <Pressable onPress={closeAll}>
        <Text className="text-primary dark:text-primary-content text-4xl font-bold mb-4 px-6 pt-4">
          Messagerie
        </Text>
      </Pressable>

      <SearchBar
        className="rounded-[10] mx-4"
        onFocus={closeAll}
        value={searchText}
        placeholder="Rechercher une conversation..."
        onChangeText={setSearchText}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        stickySectionHeadersEnabled={false}
        onScrollBeginDrag={closeAll}
        renderSectionHeader={({ section: { title, icon } }) => (
          <SectionHeader title={title} icon={icon} />
        )}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            isOpen={openRowId === item.id}
            onSwipeOpen={() => setOpenRowId(item.id)}
            onPin={() => handlePin(item.id)}
            onPress={(id) => {
              if (openRowId !== null) {
                setOpenRowId(null);
              } else {
                router.push(`/chat/${id}`);
              }
            }}
          />
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={
          <View className="items-center mt-20 px-10">
            <Text className="text-neutral-500 text-center">
              {selectedPubId
                ? 'Aucun message pour cette mission.'
                : 'Aucune conversation correspondante.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
