import { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionList, Text, View, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import SearchBar from '@koudmain/ui/components/tools/SearchBar';
import { normalizeText } from '@koudmain/ui/utils/text';
import ConversationItem from '@/components/messaging/ConversationItem';
import SectionHeader from '@/components/messaging/SectionsHeader';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { useCompany } from '@/context/CompanyContext';
import { chatService } from '@/api/chat.api';
import { IConversation } from '@/types/conversation';

export default function Messaging() {
  const [searchText, setSearchText] = useState('');
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);

  const { session } = useSession();
  const { activeCompanyId } = useCompany();

  useFocusEffect(
    useCallback(() => {
      return () => setOpenRowId(null);
    }, []),
  );

  useEffect(() => {
    if (session && activeCompanyId) {
      chatService
        .getCompanyConversation(session, Number(activeCompanyId))
        .then((history) => {
          setConversations(history);
        })
        .catch((err) => console.error("Erreur lors de la récupération de l'historique:", err));
    }
  }, [session, activeCompanyId]);

  const closeAll = () => {
    setOpenRowId(null);
  };

  const handlePin = (id: number) => {
    const convIndex = conversations.findIndex((c) => c.id === id);
    if (convIndex !== -1 && conversations[convIndex].settings) {
      conversations[convIndex].settings.is_pinned = !conversations[convIndex].settings.is_pinned;
      setOpenRowId(null);
    }
  };

  const sections = useMemo(() => {
    const cleanQuery = normalizeText(searchText.trim());
    const tokens = cleanQuery.length > 0 ? cleanQuery.split(/\s+/) : [];
    const filtered = conversations.filter((conv) => {
      const workerUser = conv.worker?.user;
      const workerName = `${workerUser?.first_name || ''} ${workerUser?.last_name || ''}`;
      const pubTitle = conv.publication?.title || '';
      const lastMessageText = conv.last_message?.[0]?.content_text || '';
      const searchableText = normalizeText(`${workerName} ${pubTitle} ${lastMessageText}`);
      return tokens.every((token) => searchableText.includes(token));
    });

    const pinned = filtered.filter((c) => c.settings?.is_pinned);
    const others = filtered.filter((c) => !c.settings?.is_pinned);

    const result = [];
    if (pinned.length > 0) {
      result.push({ title: 'Messages épinglés', data: pinned, icon: 'pin' });
      result.push({ title: 'Tous les messages', data: others, icon: 'wechat' });
    } else {
      result.push({ title: '', data: others, icon: '' });
    }
    return result;
  }, [searchText, conversations]);

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
        ListFooterComponent={<View className="h-[100px]" />}
        ListEmptyComponent={
          <View className="items-center mt-20 px-10">
            <Text className="text-neutral-500 text-center">
              Aucune conversation correspondante.
            </Text>
          </View>
        }
      />
    </View>
  );
}
