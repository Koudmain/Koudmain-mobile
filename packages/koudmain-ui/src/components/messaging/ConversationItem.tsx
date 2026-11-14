import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { cnFusion } from '../../utils/cnFusion';
import { IConversation, Conversation } from '../../types/conversation';
import { ButtonRightAction } from './ButtonRightAction';

export interface ConversationItemProps {
  conversation: IConversation | Conversation;
  isOpen: boolean;
  onSwipeOpen: () => void;
  onPress: (id: number) => void;
  onArchive?: (id: number) => void;
  onPin?: (id: number) => void;
  onMore?: (id: number) => void;
  className?: string;
  variant?: 'employer' | 'worker';
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const formatLastMessageDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const isSameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return 'Hier';
  }

  return d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
};

export const ConversationItem = ({
  conversation,
  isOpen,
  onSwipeOpen,
  onPress,
  onArchive,
  onPin,
  onMore,
  className,
  variant,
  title,
  subtitle,
  imageUrl,
}: ConversationItemProps) => {
  const hasUnread = false;
  const unreadCount = 0;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isIConversation =
    'worker' in conversation || 'publication' in conversation || 'company' in conversation;

  // Informations candidat / travailleur (employeur)
  const workerUser =
    'worker' in conversation && conversation.worker ? conversation.worker.user : undefined;
  const workerFullName = workerUser
    ? [workerUser.first_name, workerUser.last_name].filter(Boolean).join(' ')
    : undefined;

  // Informations entreprise (travailleur)
  const company =
    ('company' in conversation && conversation.company) ||
    ('publication' in conversation && conversation.publication?.company) ||
    undefined;
  const companyName = company?.name;

  // Informations publication / offre
  const pubTitle =
    ('publication' in conversation && conversation.publication?.title) ||
    ('publication_title' in conversation ? conversation.publication_title : undefined);

  // Informations mock
  const otherUserName =
    'other_user_name' in conversation ? conversation.other_user_name : undefined;

  // Détermination du mode d'affichage
  const isWorkerMode =
    variant === 'worker' || (!workerFullName && (Boolean(companyName) || Boolean(pubTitle)));

  let displayName = title;
  let displaySubtitle = subtitle;

  if (!displayName) {
    if (isWorkerMode) {
      if (companyName) {
        displayName = companyName;
        if (pubTitle && !displaySubtitle) {
          displaySubtitle = pubTitle;
        }
      } else if (pubTitle) {
        displayName = pubTitle;
      } else if (otherUserName) {
        displayName = otherUserName;
      } else {
        displayName = 'Discussion';
      }
    } else {
      displayName = workerFullName || otherUserName || 'Candidat';
      if (pubTitle && !displaySubtitle) {
        displaySubtitle = pubTitle;
      }
    }
  }

  let avatarUrl = imageUrl;
  if (!avatarUrl) {
    if (isWorkerMode) {
      avatarUrl =
        company?.logoUrl ||
        company?.logo_url ||
        ('other_user_avatar' in conversation ? conversation.other_user_avatar : undefined);
    } else {
      avatarUrl =
        workerUser?.profile_picture_url ||
        ('other_user_avatar' in conversation ? conversation.other_user_avatar : undefined);
    }
  }

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const initial = (displayName || 'D').trim().charAt(0).toUpperCase();

  const lastMessage =
    isIConversation && 'last_message' in conversation && conversation.last_message
      ? conversation.last_message[0]
      : null;
  const lastMessageText =
    lastMessage?.content_text ||
    ('last_message_content' in conversation ? conversation.last_message_content : '');
  const lastMessageTime = formatLastMessageDate(
    lastMessage?.created_at ||
      ('last_message_time' in conversation ? conversation.last_message_time : undefined),
  );

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
          {avatarUrl && !imageError ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-14 h-14 rounded-full bg-neutral-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-hover items-center justify-center">
              <Text className="text-primary-600 dark:text-primary-content font-bold text-lg">
                {initial}
              </Text>
            </View>
          )}
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
              {displayName}
            </Text>
            {lastMessageTime ? (
              <Text
                className={cnFusion(
                  'text-xs',
                  hasUnread ? 'text-primary dark:text-neutral-200 font-bold' : 'text-neutral-500',
                )}
              >
                {lastMessageTime}
              </Text>
            ) : null}
          </View>

          {displaySubtitle ? (
            <Text
              className="text-[11px] text-primary-disabled uppercase font-bold tracking-tight mb-0.5"
              numberOfLines={1}
            >
              {displaySubtitle}
            </Text>
          ) : null}

          <View className="flex-row items-center">
            <Text
              className={cnFusion(
                'flex-1 text-sm mr-2',
                hasUnread ? 'text-primary dark:text-neutral-200 font-semibold' : 'text-neutral-500',
              )}
              numberOfLines={1}
            >
              {lastMessageText}
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
};

export default ConversationItem;
