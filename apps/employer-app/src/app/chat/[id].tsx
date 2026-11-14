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
import { HeaderChat } from '@/components/messaging/chat/HeaderChat';
import { colors } from '@/constants/theme';
import MessageBubble from '@/components/messaging/chat/MessageBubble';
import MessageInput from '@/components/messaging/chat/MessageInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '@koudmain/ui/store/useChatStore';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { useCompany } from '@/context/CompanyContext';
import { chatService } from '@/api/chat.api';
import { IMessage } from '@/types/message';
import { IConversation } from '@/types/conversation';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const { session, user } = useSession();
  const { activeCompanyId } = useCompany();

  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const currentChatMessages = useMemo(() => {
    return messages
      .filter((m) => {
        const mConvId = m.conversationId;
        return Number(mConvId) === conversationId;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [messages, conversationId]);

  useEffect(() => {
    if (session && conversationId) {
      setIsLoading(true);
      Promise.allSettled([
        chatService
          .getMessages(session, conversationId)
          .then((history) => {
            setMessages(history);
          })
          .catch((err) => console.error("Erreur lors de la récupération de l'historique:", err)),
        chatService
          .getOneCompanyConversation(session, conversationId)
          .then((conv) => {
            setConversation(conv);
          })
          .catch((err) => console.error('Erreur lors de la récupération de la conversation:', err)),
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [session, conversationId, setMessages]);

  const checkIsMe = (item: IMessage) => {
    if (item.isOptimistic) return true;

    const senderId = Number(item.sender_id);

    // 1. Si le sender_id correspond à l'utilisateur connecté (standard du backend via JWT)
    if (user?.id && senderId === user.id) return true;

    // 2. Si le sender_id correspond explicitement au candidat/worker, ce n'est PAS vous
    if (
      conversation?.worker &&
      (senderId === conversation.worker.id ||
        senderId === conversation.worker.userId ||
        senderId === conversation.worker.user?.id)
    ) {
      return false;
    }

    // 3. Si le sender_id correspond à l'entreprise
    if (activeCompanyId && senderId === Number(activeCompanyId)) return true;
    if (conversation?.companyId && senderId === conversation.companyId) return true;

    return false;
  };

  const handleSend = async (text: string) => {
    if (!session || !conversationId || !text.trim()) return;

    const mySenderId = user?.id || Number(activeCompanyId) || conversation?.companyId || 0;

    const tempId = Date.now();
    const optimisticMessage: IMessage = {
      id: tempId,
      conversationId: conversationId,
      sender_id: mySenderId,
      content_text: text,
      created_at: new Date().toISOString(),
      message_type: 'text',
      type: 'MESSAGE',
      isOptimistic: true,
    };

    useChatStore.getState().addMessage(optimisticMessage);

    try {
      await chatService.sendMessage(session, conversationId, text);
    } catch (err) {
      console.error("Erreur d'envoi réel:", err);
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

  const workerUser = conversation.worker?.user;
  const workerName =
    [workerUser?.first_name, workerUser?.last_name].filter(Boolean).join(' ') || 'Candidat';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-primary" edges={['bottom']}>
      <View className="flex-1 bg-white dark:bg-primary">
        <Stack.Screen
          options={{
            headerTitle: () => (
              <HeaderChat
                userName={workerName}
                publicationTitle={conversation.publication?.title || ''}
                userImage={workerUser?.profile_picture_url || undefined}
                workerId={conversation.worker?.id}
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
