import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Input, InputField } from '../../ui/input';
import { colors } from '../../../constants/theme';

interface MessageInputProps {
  onSend: (text: string) => Promise<void>;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  placeholder = 'Votre message...',
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (value.trim().length > 0 && !isSending) {
      setIsSending(true);
      try {
        await onSend(value);
        setValue('');
      } catch (error) {
        console.error("Erreur d'envoi:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const isTyping = value.length > 0;

  return (
    <View className="flex-row items-end justify-center px-3 w-[95%] rounded-full bg-neutral-200 dark:bg-primary-hover border-t border-neutral-100 dark:border-neutral-800">
      <View className="flex-1 mr-2 justify-center items-center">
        <Input variant="outline" size="md" className="border-transparent">
          <InputField
            placeholder={placeholder}
            className="text-primary-900 dark:text-white py-2"
            style={{ textAlignVertical: 'center' }}
            value={value}
            onChangeText={setValue}
            multiline={true}
            editable={!isSending}
          />
        </Input>
      </View>

      <View className="flex-row items-center h-10">
        {!isTyping && !isSending ? (
          <View className="flex-row items-center">
            <TouchableOpacity className="mx-1 p-1">
              <Ionicons name="mic-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity className="mx-1 p-1">
              <Ionicons name="image-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity className="ml-1 p-1">
              <Ionicons name="camera-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSend}
            disabled={isSending || !isTyping}
            className="bg-secondary w-12 h-8 rounded-[15] items-center justify-center shadow-sm"
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.primary.content} />
            ) : (
              <Feather name="send" size={22} color={colors.primary.content} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
