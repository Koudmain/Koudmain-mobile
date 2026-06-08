import React, { useEffect } from 'react';
import { View, Text, useColorScheme, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
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
  const { session } = useSession();
  const { activeCompanyId } = useCompany();

  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const [conversation, setConversation] = React.useState<IConversation | null>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentChatMessages = messages
    .filter((m) => m.conversation_id === conversationId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  useEffect(() => {
    if (session && conversationId) {
      chatService
        .getMessages(session, conversationId)
        .then((history) => {
          setMessages(history);
        })
        .catch((err) => console.error("Erreur lors de la récupération de l'historique:", err));
      chatService
        .getOneCompanyConversation(session, conversationId)
        .then((conv) => {
          setConversation(conv);
        })
        .catch((err) => console.error('Erreur lors de la récupération de la conversation:', err));
    }
  }, [session, conversationId, setMessages, setConversation]);

  const handleSend = async (text: string) => {
    if (!session || !conversationId || !text.trim()) return;

    const tempId = Date.now();
    const optimisticMessage: IMessage = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: Number(activeCompanyId),
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

  if (!conversation) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Conversation introuvable</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-primary" edges={['bottom']}>
      <View className="flex-1 bg-white dark:bg-primary">
        <Stack.Screen
          options={{
            headerTitle: () => (
              <HeaderChat
                userName={
                  conversation.worker?.user.first_name + ' ' + conversation.worker?.user.last_name
                }
                publicationTitle={conversation.publication?.title}
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 125 : 0}
        >
          <FlatList
            data={currentChatMessages}
            renderItem={({ item }) => (
              <MessageBubble message={item} isMe={item.sender_id === Number(activeCompanyId)} />
            )}
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
