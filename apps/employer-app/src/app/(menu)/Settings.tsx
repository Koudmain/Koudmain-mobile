import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, useColorScheme } from 'react-native';
import {
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Divider,
} from '@koudmain/ui/gluestack';

import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';

import { useSession } from '@koudmain/ui/context/SessionContext';
import * as ImagePicker from 'expo-image-picker';
import HeaderProfileSettings from '@/components/menu/settings/HeaderProfileSettings';
import AnimatedProfileButtons from '@/components/menu/settings/AnimatedProfileButtons';
import { colors } from '@/constants/theme';
import { userService } from '@koudmain/ui/api/user.api';

export default function SettingsScreen() {
  const { user, session, refreshUser, signOut } = useSession();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [tempImage, setTempImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!session) return;

    try {
      await userService.updateProfile(session, {
        first_name: firstName,
        last_name: lastName,
        imageUri: tempImage,
      });

      await refreshUser();

      setTempImage(null);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour.');
    } finally {
    }
  };

  const handleCancelProfile = () => {
    setFirstName(user?.first_name || '');
    setLastName(user?.last_name || '');
    setTempImage(null);
    setIsEditing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-secondary-50 dark:bg-primary-hover"
      bounces={false}
      overScrollMode="never"
    >
      <HeaderProfileSettings
        user={user}
        tempImage={tempImage}
        isEditing={isEditing}
        onPickImage={pickImage}
      />

      <VStack space="lg" className="px-4 pb-10">
        <View className="flex-1 bg-white dark:bg-primary py-6 px-4 mt-[-80] rounded-[20]">
          <Heading size="md" className="text-primary dark:text-white mb-6 text-2xl">
            Compte
          </Heading>

          <VStack className="bg-white dark:bg-primary p-5 rounded-full">
            <SettingsFormControl
              label="Prénom"
              value={firstName}
              onChange={setFirstName}
              isEditing={isEditing}
            />
            <SettingsFormControl
              label="Nom"
              value={lastName}
              onChange={setLastName}
              isEditing={isEditing}
            />
          </VStack>

          <AnimatedProfileButtons
            onSave={handleSaveProfile}
            onCancel={handleCancelProfile}
            setIsEditing={setIsEditing}
          />

          <Heading size="md" className="text-primary dark:text-white mt-8 mb-6 text-2xl">
            Préférences
          </Heading>

          <VStack className="bg-white dark:bg-primary overflow-hidden">
            <SettingsItem iconName="bell" title="Notifications" isDark={isDark} />
            <Divider className="bg-gray-200 dark:bg-primary-hover mx-4" />
            <SettingsItem iconName="shield" title="Sécurité" isDark={isDark} />
            <Divider className="bg-gray-200 dark:bg-primary-hover mx-4" />

            <TouchableOpacity onPress={signOut} className="flex-row items-center p-4">
              <Feather name="log-out" size={20} color={colors.error.DEFAULT} />
              <Text className="text-error font-semibold ml-3">Déconnexion</Text>
            </TouchableOpacity>
          </VStack>
        </View>
      </VStack>
    </ScrollView>
  );
}

const SettingsItem = ({
  iconName,
  title,
  isDark,
}: {
  iconName: any;
  title: string;
  isDark: boolean;
}) => (
  <TouchableOpacity className="flex-row justify-between items-center p-4">
    <HStack space="md" className="items-center">
      <Feather
        name={iconName}
        size={20}
        color={isDark ? colors.primary.content : colors.primary.DEFAULT}
      />
      <Text className="text-primary dark:text-white font-medium ml-3">{title}</Text>
    </HStack>
    <Entypo
      name="chevron-right"
      size={18}
      color={isDark ? colors.primary.content : colors.primary.DEFAULT}
    />
  </TouchableOpacity>
);

const SettingsFormControl = ({
  label,
  value,
  onChange,
  isEditing,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  isEditing: boolean;
}) => (
  <FormControl className="mt-4" isReadOnly={!isEditing}>
    <FormControlLabel>
      <FormControlLabelText className="text-gray-600 dark:text-gray-400">
        {label}
      </FormControlLabelText>
    </FormControlLabel>
    <Input variant="underlined" className="border-gray-300 dark:border-gray-700 h-12">
      <InputField
        className={isEditing ? 'text-primary dark:text-white' : ' text-primary-disabled'}
        value={value}
        onChangeText={onChange}
      />
    </Input>
  </FormControl>
);
