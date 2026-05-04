import { Message } from '@/types/message';
import { Text, useColorScheme, View } from 'react-native';

function MessageBubble({ message }: { message: Message }) {
  const isSentByMe = message.sender_id === 99; // ID de l'utilisateur actuel (à remplacer)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className={`max-w-[80%] px-4 py-2 rounded-lg mb-2 ${
        isSentByMe
          ? `self-end ${'bg-secondary'}`
          : `self-start ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`
      }`}
    >
      {isSentByMe ? (
        <View>
          <Text className="text-white">{message.text}</Text>
          <Text className={`text-[10px] mt-1 text-white`}>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      ) : (
        <View>
          <Text className={`${isDark ? 'text-white' : 'text-black'}`}>{message.text}</Text>
          <Text
            className={`text-[10px] mt-1 ${isDark ? 'text-primary-disabled' : 'text-neutral-500'}`}
          >
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

export default MessageBubble;
