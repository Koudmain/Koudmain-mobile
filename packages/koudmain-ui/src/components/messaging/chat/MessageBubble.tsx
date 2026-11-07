import React from 'react';
import { IMessage } from '../../../types/message';
import { Text, useColorScheme, View } from 'react-native';

export interface MessageBubbleProps {
  message: IMessage;
  isMe?: boolean;
}

const formatTime = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const timeFormatted = formatTime(message.created_at);

  return (
    <View
      className={`max-w-[80%] px-4 py-2.5 mb-2.5 shadow-sm ${
        isMe
          ? 'self-end bg-secondary rounded-2xl rounded-br-none'
          : `self-start rounded-2xl rounded-bl-none ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`
      } ${message.isOptimistic ? 'opacity-75' : 'opacity-100'}`}
    >
      {isMe ? (
        <View>
          <Text className="text-white text-[15px] leading-5">{message.content_text}</Text>
          {timeFormatted ? (
            <Text className="text-[10px] mt-1 text-white/80 text-right font-medium">
              {timeFormatted}
            </Text>
          ) : null}
        </View>
      ) : (
        <View>
          <Text className={`text-[15px] leading-5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {message.content_text}
          </Text>
          {timeFormatted ? (
            <Text
              className={`text-[10px] mt-1 font-medium ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              {timeFormatted}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

export default MessageBubble;
