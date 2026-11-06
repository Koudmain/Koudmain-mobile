import { Image, Pressable, Text, View } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ICompanyProfile } from '../../../types/profile';
import { colors } from '../../../constants/theme';
import defaultCover from '../../../assets/images/default-company-cover.png';

interface CompanyProfileHeaderProps {
  company: ICompanyProfile;
  onEdit?: () => void;
}

export function CompanyProfileHeader({ company, onEdit }: CompanyProfileHeaderProps) {
  const address =
    company.address?.full_address ||
    [company.address?.street_number, company.address?.street_name, company.address?.city]
      .filter(Boolean)
      .join(' ');
  const establishmentInfo = [company.companyType, company.specialties].filter(Boolean).join(' · ');

  return (
    <View>
      <View className="h-44 border-b-8 border-secondary">
        <Image
          source={company.coverImageUrl ? { uri: company.coverImageUrl } : defaultCover}
          className="w-full h-full"
          resizeMode="cover"
        />
        <Pressable
          onPress={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 rounded-full items-center justify-center bg-black/40"
        >
          <Feather name="arrow-left" size={24} color={colors.primary.content} />
        </Pressable>
        {onEdit && (
          <Pressable
            onPress={onEdit}
            accessibilityLabel="Modifier le profil de l'établissement"
            className="absolute top-4 right-4 w-10 h-10 rounded-full items-center justify-center bg-black/40"
          >
            <Feather name="edit-2" size={20} color={colors.primary.content} />
          </Pressable>
        )}
      </View>

      <View className="absolute top-28 left-4 w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
        {company.logoUrl ? (
          <Image source={{ uri: company.logoUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-primary-100">
            <FontAwesome6 name="utensils" size={32} color={colors.primary.DEFAULT} />
          </View>
        )}
      </View>

      <View className="px-6 mt-14">
        <Text className="text-2xl font-extrabold text-primary dark:text-white">{company.name}</Text>
        {!!address && (
          <Text className="mt-1 text-sm text-primary-600 dark:text-primary-300">{address}</Text>
        )}
        {!!establishmentInfo && (
          <Text className="mt-0.5 text-sm text-primary-600 dark:text-primary-300">
            {establishmentInfo}
          </Text>
        )}
      </View>
    </View>
  );
}
