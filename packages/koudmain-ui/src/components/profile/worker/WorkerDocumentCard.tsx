import { Alert, Linking, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { IWorkerProfileDocument } from '../../../types/profile';
import { colors } from '../../../constants/theme';

interface WorkerDocumentCardProps {
  label: string;
  document: IWorkerProfileDocument;
}

const formatFileSize = (sizeBytes: number | null) => {
  if (!sizeBytes) return null;
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} ko`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
};

export function WorkerDocumentCard({ label, document }: WorkerDocumentCardProps) {
  const icon = useColorScheme() === 'dark' ? colors.primary.content : colors.primary.DEFAULT;
  const size = formatFileSize(document.sizeBytes);

  return (
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(document.url).catch(() =>
          Alert.alert('Document indisponible', "Ce document n'a pas pu être ouvert."),
        )
      }
      activeOpacity={0.8}
      className="flex-row items-center p-3 mb-3 rounded-lg bg-white dark:bg-primary-700 shadow-md"
      style={{ elevation: 4 }}
    >
      <View className="w-12 h-12 items-center justify-center rounded-lg bg-secondary-50">
        <MaterialCommunityIcons
          name="file-document-edit-outline"
          size={26}
          color={colors.secondary.DEFAULT}
        />
      </View>
      <View className="flex-1 mx-3">
        <Text className="text-base font-bold text-primary dark:text-white" numberOfLines={1}>
          {document.name}
        </Text>
        <Text className="text-xs font-medium text-primary-500 dark:text-primary-300">
          {[label, size].filter(Boolean).join(' · ')}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={28} color={icon} />
    </TouchableOpacity>
  );
}
