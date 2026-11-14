import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { WorkerApplicationSummaryData } from '@/utils/offerMapper';

// Matches the `maxLength` of `ApplyDto.message` in the backend OpenAPI schema
export const APPLICATION_MESSAGE_MAX_LENGTH = 150;

interface ApplicationBottomSheetProps {
  visible: boolean;
  summary: WorkerApplicationSummaryData;
  onClose: () => void;
  onSubmit: (message: string) => void;
  isSubmitting?: boolean;
}

interface CharacterCounterRingProps {
  current: number;
  max: number;
  isDark?: boolean;
}

function CharacterCounterRing({ current, max, isDark = false }: CharacterCounterRingProps) {
  const size = 16;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(1, current / max);
  const trackStroke = isDark ? colors.secondary[20] : colors.secondary[100];
  const progressStroke = isDark ? colors.secondary[400] : colors.secondary.DEFAULT;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackStroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={progressStroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={circumference * (1 - ratio)}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ApplicationBottomSheet({
  visible,
  summary,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ApplicationBottomSheetProps) {
  const isDark = useColorScheme() === 'dark';
  const [isMounted, setIsMounted] = useState(visible);
  const [message, setMessage] = useState('');
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setIsMounted(false);
      });
    }
  }, [visible, progress]);

  // Reset the draft message each time the sheet is opened
  useEffect(() => {
    if (visible) setMessage('');
  }, [visible]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  const iconColor = isDark ? colors.primary.content : colors.primary.DEFAULT;
  const accentIconColor = isDark ? colors.secondary[400] : colors.secondary.DEFAULT;
  const formattedRating = summary.rating.toFixed(1).replace('.', ',');
  const trimmedMessage = message.trim();
  const canSubmit = trimmedMessage.length > 0 && !isSubmitting;

  return (
    <Modal animationType="none" transparent visible={isMounted} onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Dimmed backdrop, tapping it closes the sheet */}
        <Animated.View className="absolute inset-0 bg-black/40" style={{ opacity: progress }}>
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          className="px-5 pt-3 pb-10 rounded-t-3xl border-t border-primary-100 dark:border-primary-700 bg-white dark:bg-primary"
          style={{ transform: [{ translateY }] }}
        >
          {/* Drag handle */}
          <View className="self-center w-12 h-1.5 mb-4 rounded-full bg-neutral-300 dark:bg-primary-600" />

          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-primary dark:text-primary-content">
              Finaliser ma candidature
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              className="w-9 h-9 rounded-full items-center justify-center bg-primary-50 dark:bg-primary-active"
            >
              <Feather name="x" size={20} color={iconColor} />
            </Pressable>
          </View>

          {/* Offer summary card */}
          <View className="rounded-2xl border border-primary-100 dark:border-primary-700 bg-white dark:bg-primary-active px-4 py-3 mb-5">
            <View className="flex-row items-center mb-2">
              {summary.companyLogo ? (
                <Image
                  source={summary.companyLogo}
                  className="w-12 h-12 rounded-full border border-neutral-300 bg-white mr-3"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-12 h-12 rounded-full border border-neutral-300 mr-3 items-center justify-center bg-primary-100">
                  <FontAwesome6 name="utensils" size={18} color={colors.primary.DEFAULT} />
                </View>
              )}
              <View className="flex-1">
                <Text
                  className="text-base font-bold text-primary dark:text-primary-content"
                  numberOfLines={1}
                >
                  {summary.companyName}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-sm font-bold text-neutral-700 dark:text-primary-200">
                    {summary.location}
                  </Text>
                  <MaterialIcons
                    name="star"
                    size={14}
                    color={colors.utils.star}
                    style={{ marginLeft: 6, marginRight: 2 }}
                  />
                  <Text className="text-sm font-bold text-neutral-700 dark:text-primary-100">
                    {formattedRating} ({summary.reviewCount})
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-2">
              <Text
                className="flex-1 text-2xl font-bold text-primary dark:text-primary-content mr-2"
                numberOfLines={1}
              >
                {summary.title}
              </Text>
              <View className="flex-row items-center bg-secondary-50 dark:bg-secondary-20 px-2.5 py-1 rounded-full">
                <FontAwesome6 name="money-bill-wave" size={12} color={accentIconColor} />
                <Text className="text-sm font-bold text-secondary dark:text-secondary-400 ml-1.5">
                  {summary.wage}€ / h
                </Text>
              </View>
            </View>

            <View className="h-px bg-primary-100 dark:bg-primary-700 mb-2" />

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather name="calendar" size={14} color={accentIconColor} />
                <Text className="text-sm font-bold text-primary dark:text-primary-50 ml-1.5">
                  {summary.dateLabel}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="watch-later" size={15} color={accentIconColor} />
                <Text className="text-sm font-bold text-primary dark:text-primary-50 ml-1.5">
                  {summary.startTime}
                </Text>
              </View>
              <View className="flex-row items-center">
                <FontAwesome6 name="hourglass-half" size={12} color={accentIconColor} />
                <Text className="text-sm font-bold text-primary dark:text-primary-50 ml-1.5">
                  {summary.duration}
                </Text>
              </View>
            </View>
          </View>

          {/* Message input */}
          <Text className="text-base font-bold text-primary dark:text-primary-content mb-2">
            Message pour l'établissement
          </Text>
          <View className="rounded-2xl border-2 border-secondary dark:border-secondary-400 bg-secondary-50/40 dark:bg-primary-active px-4 pt-3 pb-2.5 mb-5">
            <TextInput
              value={message}
              onChangeText={setMessage}
              maxLength={APPLICATION_MESSAGE_MAX_LENGTH}
              multiline
              textAlignVertical="top"
              placeholder="Présentez-vous en quelques mots à l'établissement..."
              placeholderTextColor={isDark ? colors.primary[300] : colors.primary[400]}
              className="min-h-24 text-base leading-6 text-primary dark:text-primary-50"
            />
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row ml-auto items-center">
                <CharacterCounterRing
                  current={message.length}
                  max={APPLICATION_MESSAGE_MAX_LENGTH}
                  isDark={isDark}
                />
                <Text className="text-sm font-bold text-secondary dark:text-secondary-400 ml-1.5">
                  {message.length} / {APPLICATION_MESSAGE_MAX_LENGTH}
                </Text>
              </View>
            </View>
          </View>

          {/* Submit button: disabled while submitting or when the message is empty (whitespace only counts as empty) */}
          <Pressable
            disabled={!canSubmit}
            onPress={() => {
              if (!canSubmit) return;
              onSubmit(trimmedMessage);
            }}
            className={`w-full h-14 rounded-2xl flex-row items-center justify-center ${
              canSubmit
                ? 'bg-secondary active:bg-secondary-active'
                : 'bg-secondary-300 dark:bg-secondary-700'
            }`}
          >
            <Text className="text-secondary-content font-bold text-lg mr-2">
              Envoyer ma candidature
            </Text>
            <Feather name="send" size={18} color={colors.secondary.content} />
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
