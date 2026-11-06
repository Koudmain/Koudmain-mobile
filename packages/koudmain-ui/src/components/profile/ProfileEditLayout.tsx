import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { Button } from '../ui/Button';
import { colors } from '../../constants/theme';

interface ProfileEditLayoutProps {
  title: string;
  canSave: boolean;
  onSave: () => Promise<boolean>;
  children: React.ReactNode;
}

export default function ProfileEditLayout({
  title,
  canSave,
  onSave,
  children,
}: ProfileEditLayoutProps) {
  const navigation = useNavigation();
  const icon = useColorScheme() === 'dark' ? colors.primary.content : colors.primary.DEFAULT;
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const isDisabled = !canSave || isSaving;

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (isSavingRef.current) event.preventDefault();
      }),
    [navigation],
  );

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !isSaving });
  }, [navigation, isSaving]);

  const handleSave = async () => {
    isSavingRef.current = true;
    setIsSaving(true);
    const shouldClose = await onSave().catch(() => false);
    isSavingRef.current = false;

    if (shouldClose) router.back();
    else setIsSaving(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-primary"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-row items-center px-6 mt-4">
        <TouchableOpacity onPress={() => router.back()} disabled={isSaving} className="w-10">
          <Ionicons name="chevron-back" size={30} color={icon} />
        </TouchableOpacity>
        <Text
          className="flex-1 text-xl font-extrabold text-center text-primary dark:text-white"
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-6 pb-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}

        <View className="mt-auto pt-8">
          <Button
            label={isSaving ? 'Enregistrement…' : 'Enregistrer'}
            variant={isDisabled ? 'muted' : 'primary'}
            size="lg"
            disabled={isDisabled}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
