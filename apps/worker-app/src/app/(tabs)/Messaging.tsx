import { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionList, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import SearchBar from '@koudmain/ui/components/tools/SearchBar';
import { normalizeText } from '@koudmain/ui/utils/text';
import { ConversationItem } from '@koudmain/ui/components/messaging/ConversationItem';
import { SectionHeader } from '@koudmain/ui/components/messaging/SectionsHeader';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { IConversation } from '@/types/conversation';
import { chatService } from '@/api/chat.api';
import { colors } from '@/constants/theme';

export default function Messaging() {
  const [searchText, setSearchText] = useState('');
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();

  useFocusEffect(
    useCallback(() => {
      return () => setOpenRowId(null);
    }, []),
  );

  useEffect(() => {
    if (session) {
      setIsLoading(true);
      chatService
        .getWorkerConversations(session)
        .then((data) => {
          setConversations(data || []);
        })
        .catch((err) => {
          console.error('[Worker Messaging] Error fetching conversations:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const closeAll = () => {
    setOpenRowId(null);
  };

  const handlePin = (id: number) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.settings) {
          return {
            ...c,
            settings: {
              ...c.settings,
              is_pinned: !c.settings.is_pinned,
            },
          };
        }
        return {
          ...c,
          is_pinned: !c.is_pinned,
        };
      }),
    );
    setOpenRowId(null);
  };

  const sections = useMemo(() => {
    const cleanQuery = normalizeText(searchText.trim());
    const tokens = cleanQuery.length > 0 ? cleanQuery.split(/\s+/) : [];
    const filtered = conversations.filter((conv) => {
      const companyName = conv.company?.name || conv.publication?.company?.name || '';
      const pubTitle = conv.publication?.title || conv.publication_title || '';
      const userName = conv.worker?.user
        ? `${conv.worker.user.first_name || ''} ${conv.worker.user.last_name || ''}`
        : conv.other_user_name || '';
      const lastMessageText =
        conv.last_message?.[0]?.content_text || conv.last_message_content || '';

      const searchableText = normalizeText(
        `${companyName} ${pubTitle} ${userName} ${lastMessageText}`,
      );
      return tokens.every((token) => searchableText.includes(token));
    });

    const isConvPinned = (c: IConversation) => Boolean(c.settings?.is_pinned || c.is_pinned);

    const pinned = filtered.filter(isConvPinned);
    const others = filtered.filter((c) => !isConvPinned(c));

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
            variant="worker"
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
          isLoading ? (
            <View className="items-center mt-20 px-10">
              <ActivityIndicator size="large" color={colors.secondary.DEFAULT} />
            </View>
          ) : (
            <View className="items-center mt-20 px-10">
              <Text className="text-neutral-500 text-center">
                Aucune conversation correspondante.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
