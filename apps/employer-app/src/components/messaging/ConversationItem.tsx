import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { cnFusion } from '@koudmain/ui/utils/cnFusion';
import { IConversation } from '@/types/conversation';
import ButtonRightAction from './ButtonRightAction';

interface ConversationItemProps {
  conversation: IConversation;
  isOpen: boolean;
  onSwipeOpen: () => void;
  onPress: (id: number) => void;
  onArchive?: (id: number) => void;
  onPin?: (id: number) => void;
  onMore?: (id: number) => void;
  className?: string;
}

function ConversationItem({
  conversation,
  isOpen,
  onSwipeOpen,
  onPress,
  onArchive,
  onPin,
  onMore,
  className,
}: ConversationItemProps) {
  const hasUnread = false; // Placeholder, replace with future unread logic
  const unreadCount = 0; // Placeholder, replace with future unread count
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const urlImg =
    conversation.worker.user.profile_picture_url ||
    'https://www.cuisine-essentiel.fr/images/2020/10/avatar-neutre.png';

  useEffect(() => {
    if (!isOpen) {
      swipeableRef.current?.close();
    }
  }, [isOpen, onSwipeOpen]);
  const swipeableRef = useRef<SwipeableMethods>(null);

  const closeSwipe = () => {
    swipeableRef.current?.close();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={(prog) => (
        <ButtonRightAction
          prog={prog}
          conversation={conversation}
          onMore={onMore}
          onPin={onPin}
          onArchive={onArchive}
          closeSwipe={closeSwipe}
          isDark={isDark}
        />
      )}
      friction={2.5}
      animationOptions={{
        duration: 500,
      }}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      onSwipeableWillOpen={onSwipeOpen}
    >
      <TouchableOpacity
        onPress={() => onPress(conversation.id)}
        activeOpacity={0.9}
        className={cnFusion(
          'flex-row items-center py-3 px-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-primary-hover',
          className,
        )}
      >
        <View className="relative">
          <Image
            source={{
              uri: urlImg,
            }}
            className="w-14 h-14 rounded-full bg-neutral-200"
          />
        </View>

        <View className="flex-1 ml-4">
          <View className="flex-row justify-between items-center mb-1">
            <Text
              className={cnFusion(
                'text-base text-neutral-900 dark:text-white',
                hasUnread ? 'font-bold' : 'font-medium',
              )}
              numberOfLines={1}
            >
              {conversation.worker.user.first_name} {conversation.worker.user.last_name}
            </Text>
            <Text
              className={cnFusion(
                'text-xs',
                hasUnread ? 'text-primary dark:text-neutral-200 font-bold' : 'text-neutral-500',
              )}
            >
              {conversation.last_message[0]?.created_at}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text
              className={cnFusion(
                'flex-1 text-sm mr-2',
                hasUnread ? 'text-primary dark:text-neutral-200 font-semibold' : 'text-neutral-500',
              )}
              numberOfLines={1}
            >
              {conversation.last_message[0]?.content_text}
            </Text>
            {hasUnread && (
              <View className="bg-primary-500 min-w-[20px] h-5 px-1.5 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export default ConversationItem;
