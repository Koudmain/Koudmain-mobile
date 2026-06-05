import { TouchableOpacity, View, Image } from 'react-native';
import { VStack, Heading, Text } from '@koudmain/ui/gluestack';
import Feather from '@expo/vector-icons/Feather';
import { User } from '@koudmain/ui/types';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';

interface HeaderProfileSettingsProps {
  user: User | null;
  tempImage: string | null;
  isEditing: boolean;
  onPickImage: () => void;
}

function HeaderProfileSettings({
  user,
  tempImage,
  isEditing,
  onPickImage,
}: HeaderProfileSettingsProps) {
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Erreur lors du chargement';

  return (
    <VStack space="xl" className="items-center pt-20 pb-20 rounded-b-[20] mb-8 bg-secondary">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-8 left-4 z-20 p-2"
        activeOpacity={0.7}
      >
        <Feather name="chevron-left" size={42} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPickImage} activeOpacity={0.9} disabled={!isEditing}>
        <View className="relative">
          <View className="w-[104px] h-[104px] rounded-full bg-white dark:bg-gray-800 overflow-hidden items-center justify-center">
            {tempImage || user?.profile_picture_url ? (
              <Image
                source={{
                  uri: tempImage || user?.profile_picture_url || undefined,
                }}
                className="w-full h-full"
              />
            ) : (
              <Feather name="user" size={48} color={colors.primary.hover} />
            )}
          </View>

          {isEditing && (
            <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-white dark:border-black shadow-md">
              <Feather name="camera" size={16} color="white" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      <VStack className="items-center">
        <Heading size="xl" className="text-white text-center">
          {fullName}
        </Heading>
        <Text className="text-primary-content">{user?.email}</Text>
      </VStack>
    </VStack>
  );
}

export default HeaderProfileSettings;
