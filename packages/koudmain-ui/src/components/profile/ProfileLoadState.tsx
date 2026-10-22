import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/theme';

interface ProfileLoadStateProps {
  error: string | null;
  onRetry: () => void;
}

/**
 * Écran de chargement d'un profil, ou message d'erreur avec possibilité de réessayer.
 */
export default function ProfileLoadState({ error, onRetry }: ProfileLoadStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 bg-white dark:bg-primary">
      {error ? (
        <>
          <Text className="text-lg text-center text-primary dark:text-white">{error}</Text>
          <TouchableOpacity
            onPress={onRetry}
            activeOpacity={0.8}
            className="mt-6 px-8 py-3 rounded-lg bg-secondary"
          >
            <Text className="text-base font-semibold text-white">Réessayer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-base font-semibold text-secondary">Retour</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color={colors.secondary.DEFAULT} />
      )}
    </View>
  );
}
