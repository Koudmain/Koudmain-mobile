import React from 'react';
import { View, Text, useColorScheme, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MOCK_CONVERSATIONS } from '@/constants/fakeConversations';
import { HeaderChat } from '@koudmain/ui/components/messaging/chat/HeaderChat';
import { colors } from '@/constants/theme';
import { MOCK_MESSAGES } from '@/constants/fakeMessages';
import { MessageBubble } from '@koudmain/ui/components/messaging/chat/MessageBubble';
import { MessageInput } from '@koudmain/ui/components/messaging/chat/MessageInput';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === Number(id));

  const handleSend = async (text: string) => {
    console.log('Envoi du message :', text);
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
                userName={conversation.other_user_name}
                publicationTitle={conversation.publication_title}
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
            data={MOCK_MESSAGES}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item) => item.id.toString()}
            inverted
            contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
          />

          <View className="w-full mb-2 items-center bg-white dark:bg-primary border-transparent">
            <MessageInput onSend={(text: string) => handleSend(text)} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
