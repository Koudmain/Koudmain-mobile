import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { HeaderChat } from '@koudmain/ui/components/messaging/chat/HeaderChat';
import { colors } from '@/constants/theme';
import { MessageBubble } from '@koudmain/ui/components/messaging/chat/MessageBubble';
import { MessageInput } from '@koudmain/ui/components/messaging/chat/MessageInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '@koudmain/ui/store/useChatStore';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { IMessage } from '@/types/message';
import { IConversation } from '@/types/conversation';
import { chatService } from '@/api/chat.api';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const { session, user } = useSession();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const storeMessages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  useEffect(() => {
    if (session && conversationId) {
      setIsLoading(true);
      Promise.allSettled([
        chatService
          .getMessages(session, conversationId)
          .then((history) => {
            if (history) {
              setMessages(history);
            }
          })
          .catch((err) => {
            console.error('[Worker Chat] Erreur récupération messages:', err);
          }),
        chatService
          .getOneConversation(session, conversationId)
          .then((conv) => {
            if (conv) {
              setConversation(conv);
            }
          })
          .catch((err) => {
            console.error('[Worker Chat] Erreur récupération conversation:', err);
          }),
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [session, conversationId, setMessages]);

  const headerInfo = useMemo(() => {
    if (!conversation) {
      return {
        title: 'Discussion',
        subtitle: '',
        image: undefined as string | undefined,
        companyId: undefined as number | undefined,
      };
    }

    const company = conversation.company || conversation.publication?.company;
    const companyName = company?.name;

    const pubTitle = conversation.publication?.title || conversation.publication_title || '';

    const companyId =
      conversation.companyId || company?.id || conversation.publication?.companyId || undefined;

    const title = companyName || pubTitle || 'Discussion';
    const subtitle = companyName && pubTitle ? pubTitle : '';
    const image = company?.logoUrl || company?.logo_url || undefined;

    return { title, subtitle, image, companyId };
  }, [conversation]);

  const currentChatMessages = useMemo(() => {
    return storeMessages
      .filter((m) => Number(m.conversationId) === conversationId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [storeMessages, conversationId]);

  const checkIsMe = (item: IMessage) => {
    if (item.isOptimistic) return true;

    const senderId = Number(item.sender_id);

    // 1. Si le sender_id correspond à l'utilisateur connecté (JWT token session)
    if (user?.id && senderId === user.id) return true;

    // 2. Si la conversation a un worker et que le sender_id correspond au worker
    if (
      conversation?.worker &&
      (senderId === conversation.worker.id ||
        senderId === conversation.worker.userId ||
        senderId === conversation.worker.user?.id)
    ) {
      return true;
    }

    // 3. Si le sender_id correspond à l'entreprise, ce n'est PAS le salarié
    if (conversation?.companyId && senderId === conversation.companyId) {
      return false;
    }

    // 4. Par défaut, si l'ID utilisateur est connu et différent du sender_id, ce n'est pas moi
    if (user?.id && senderId !== user.id) {
      return false;
    }

    return false;
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!session || !conversationId || !trimmed) return;

    const mySenderId = user?.id || conversation?.workerId || conversation?.worker?.id || 0;
    const tempId = Date.now();

    const optimisticMessage: IMessage = {
      id: tempId,
      conversationId,
      sender_id: mySenderId,
      content_text: trimmed,
      created_at: new Date().toISOString(),
      message_type: 'text',
      type: 'MESSAGE',
      isOptimistic: true,
    };

    useChatStore.getState().addMessage(optimisticMessage);

    try {
      await chatService.sendMessage(session, conversationId, trimmed);
    } catch (err) {
      console.error('[Worker Chat] Erreur envoi réel:', err);
    }
  };

  if (isLoading && !conversation) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-primary justify-center items-center">
        <ActivityIndicator size="large" color={colors.secondary.DEFAULT} />
      </SafeAreaView>
    );
  }

  if (!conversation) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-primary justify-center items-center px-4">
        <Text className="text-neutral-500 dark:text-neutral-400 text-base text-center">
          Conversation introuvable
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-primary" edges={['bottom']}>
      <View className="flex-1 bg-white dark:bg-primary">
        <Stack.Screen
          options={{
            headerTitle: () => (
              <HeaderChat
                userName={headerInfo.title}
                publicationTitle={headerInfo.subtitle}
                userImage={headerInfo.image}
                companyId={headerInfo.companyId}
              />
            ),
            headerTitleAlign: 'left',
            headerBackVisible: false,
            headerShadowVisible: true,
            headerStyle: {
              backgroundColor: isDark ? colors.primary.DEFAULT : colors.primary.content,
            },
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            data={currentChatMessages}
            renderItem={({ item }) => <MessageBubble message={item} isMe={checkIsMe(item)} />}
            keyExtractor={(item) => item.id.toString()}
            inverted
            contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
          />

          <View className="w-full mb-2 items-center bg-white dark:bg-primary border-transparent">
            <MessageInput onSend={handleSend} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
