import { Image, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import CompetenceCard from '../../card/CompetenceCard';
import { IWorkerProfile } from '../../../types/profile';
import { colors } from '../../../constants/theme';

interface WorkerProfileHeaderProps {
  worker: IWorkerProfile;
  onEdit?: () => void;
}

export function WorkerProfileHeader({ worker, onEdit }: WorkerProfileHeaderProps) {
  const icon = useColorScheme() === 'dark' ? colors.primary.content : colors.primary.DEFAULT;
  const { user } = worker;
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <View className="items-center px-6">
      <View className="flex-row items-center w-full mt-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="chevron-back" size={30} color={icon} />
        </TouchableOpacity>
        <Text
          className="flex-1 text-xl font-extrabold text-center text-primary dark:text-white"
          numberOfLines={1}
        >
          {fullName}
        </Text>
        {onEdit ? (
          <TouchableOpacity
            onPress={onEdit}
            accessibilityLabel="Modifier mon profil"
            className="w-10 items-end"
          >
            <Feather name="edit-2" size={24} color={icon} />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
      </View>

      <View className="w-24 h-24 mt-4 rounded-full overflow-hidden bg-secondary-50">
        {user.profile_picture_url ? (
          <Image source={{ uri: user.profile_picture_url }} className="w-full h-full" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-3xl font-bold text-secondary">{user.first_name.charAt(0)}</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mt-3">
        <MaterialCommunityIcons name="calendar-check-outline" size={16} color={icon} />
        <Text className="ml-1.5 text-xs font-medium text-primary dark:text-white">
          Membre Koudmain depuis {new Date(user.createdAt).getFullYear()}
        </Text>
      </View>
      <View className="flex-row items-center mt-1">
        <MaterialIcons name="location-on" size={16} color={icon} />
        <Text className="ml-1 text-xs font-medium text-primary dark:text-white">
          {worker.address?.city ?? 'Ville non renseignée'}
        </Text>
      </View>

      {worker.skills.length > 0 && (
        <View className="flex-row flex-wrap justify-center mt-3">
          {worker.skills.map((skill) => (
            <CompetenceCard key={skill.id} comp={skill.name} size="md" />
          ))}
        </View>
      )}
    </View>
  );
}
