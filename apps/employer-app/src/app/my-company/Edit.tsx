import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { useGetCompanyProfile } from '@koudmain/ui/hooks/useGetCompanyProfile';
import { ProfileEditLayout, ProfileLoadState, ProfileSection } from '@koudmain/ui/components';
import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { AddressAutocomplete, AddressData } from '@koudmain/ui/components/form/AddressAutocomplete';
import { profileService } from '@koudmain/ui/api';
import { ICompanyProfile } from '@koudmain/ui/types';
import { useCompany } from '@/context/CompanyContext';
import { CompanyTypeSelector } from '@/components/company/CompanyTypeSelector';
import HorizontalSwitch from '@/components/switch/HorizontalSwitch';
import { colors } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function EditMyCompanyPage() {
  const { session } = useSession();
  const { activeCompanyId } = useCompany();
  const companyId = Number(activeCompanyId);
  const { companyProfile, errorCompanyProfile, refetchCompanyProfile } = useGetCompanyProfile(
    session,
    companyId,
  );

  if (!companyProfile) {
    return <ProfileLoadState error={errorCompanyProfile} onRetry={refetchCompanyProfile} />;
  }

  return <CompanyProfileForm companyId={companyId} company={companyProfile} />;
}

const pickImage = async (aspect: [number, number]) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });

    return result.canceled ? null : result.assets[0].uri;
  } catch (error) {
    console.error(error);
    alert("Impossible d'ouvrir votre galerie photo.");
    return null;
  }
};

function CompanyProfileForm({
  companyId,
  company,
}: {
  companyId: number;
  company: ICompanyProfile;
}) {
  const { session } = useSession();
  const { loadCompanies } = useCompany();
  const { icon } = useThemeColors();
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [name, setName] = useState(company.name);
  const [companyType, setCompanyType] = useState(company.companyType);
  const [specialties, setSpecialties] = useState(company.specialties ?? '');
  const [description, setDescription] = useState(company.description ?? '');
  const [capacity, setCapacity] = useState(
    company.capacity === null ? '' : String(company.capacity),
  );
  const [teamSize, setTeamSize] = useState(company.teamSize ?? '');
  const [mealProvided, setMealProvided] = useState(company.mealProvided);
  const [dressCode, setDressCode] = useState(company.dressCode ?? '');
  const [address, setAddress] = useState<AddressData | null>(null);
  const [isAddressTyped, setIsAddressTyped] = useState(false);

  const isAddressValid = !address || (!!address.streetName && !!address.zipCode && !!address.city);
  const canSave = name.trim().length > 0 && isAddressValid && !isAddressTyped;

  const handleSave = async () => {
    if (!session) return false;

    try {
      await profileService.updateCompanyProfile(session, companyId, {
        name: name.trim(),
        companyType,
        description: description.trim(),
        specialties: specialties.trim(),
        capacity,
        teamSize: teamSize.trim(),
        mealProvided,
        dressCode: dressCode.trim(),
        logoUri,
        coverUri,
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement du profil de l'établissement.");
      return false;
    }

    // Le profil est déjà enregistré : on ne le renvoie pas (ni ses images) si seule l'adresse échoue
    if (address) {
      try {
        await profileService.updateCompanyAddress(session, companyId, address);
      } catch (error) {
        console.error(error);
        alert(
          'Les informations ont été enregistrées, mais pas la nouvelle adresse. Réessayez de la modifier plus tard.',
        );
      }
    }
    await loadCompanies(session);

    return true;
  };

  const coverSource = coverUri ?? company.coverImageUrl;
  const logoSource = logoUri ?? company.logoUrl;

  return (
    <ProfileEditLayout title="Modifier mon établissement" canSave={canSave} onSave={handleSave}>
      <TouchableOpacity
        onPress={async () => setCoverUri((await pickImage([2, 1])) ?? coverUri)}
        activeOpacity={0.8}
        className="h-36 mt-6 rounded-[16] overflow-hidden bg-primary-100 items-center justify-center"
      >
        {coverSource && (
          <Image
            source={{ uri: coverSource }}
            className="absolute w-full h-full"
            resizeMode="cover"
          />
        )}
        <View className="flex-row items-center px-3 py-1.5 rounded-full bg-black/60">
          <Feather name="image" size={16} color={colors.primary.content} />
          <Text className="ml-2 text-sm font-semibold text-white">Modifier la couverture</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => setLogoUri((await pickImage([1, 1])) ?? logoUri)}
        activeOpacity={0.8}
        className="items-center mt-6"
      >
        <View className="w-24 h-24 rounded-full overflow-hidden bg-primary-100 items-center justify-center">
          {logoSource ? (
            <Image source={{ uri: logoSource }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <FontAwesome6 name="utensils" size={32} color={colors.primary.DEFAULT} />
          )}
        </View>
        <Text className="mt-2 text-sm font-semibold text-secondary">Modifier le logo</Text>
      </TouchableOpacity>

      <LabeledUnderlinedInput
        label="Nom de l'établissement"
        value={name}
        onChangeText={setName}
        containerClassName="mt-6"
      />

      <ProfileSection title="Type d'établissement">
        <CompanyTypeSelector
          value={companyType}
          onChange={(type) => type && setCompanyType(type)}
        />
      </ProfileSection>

      <LabeledUnderlinedInput
        label="Spécialités"
        placeholder="Cuisine française, brunch..."
        value={specialties}
        onChangeText={setSpecialties}
        containerClassName="mt-6"
      />
      <LabeledUnderlinedInput
        label="À propos de nous"
        placeholder="Présentez votre établissement..."
        value={description}
        onChangeText={setDescription}
        multiline
        containerClassName="mt-6"
      />

      <ProfileSection title="Adresse">
        <AddressAutocomplete
          defaultValue={company.address?.full_address ?? ''}
          placeholder="Rechercher l'adresse..."
          onChangeText={(text) => {
            setAddress(null);
            setIsAddressTyped(text !== (company.address?.full_address ?? ''));
          }}
          onSelect={(selected) => {
            setAddress(selected);
            setIsAddressTyped(false);
          }}
        />
        {isAddressTyped && (
          <Text className="text-sm text-error">Sélectionnez une adresse dans la liste.</Text>
        )}
        {!isAddressValid && (
          <Text className="text-sm text-error">
            Choisissez une adresse précise, avec un numéro et une rue.
          </Text>
        )}
      </ProfileSection>

      <ProfileSection title="Notre établissement">
        <LabeledUnderlinedInput
          label="Nombre de couverts"
          placeholder="80"
          keyboardType="number-pad"
          value={capacity}
          onChangeText={(value) => setCapacity(value.replace(/\D/g, ''))}
        />
        <LabeledUnderlinedInput
          label="Taille de l'équipe"
          placeholder="5 à 10 personnes"
          value={teamSize}
          onChangeText={setTeamSize}
          containerClassName="mt-6"
        />
        <LabeledUnderlinedInput
          label="Tenue attendue"
          placeholder="Chemise blanche, pantalon noir"
          value={dressCode}
          onChangeText={setDressCode}
          containerClassName="mt-6"
        />
        <View className="mt-6">
          <HorizontalSwitch
            isEnabled={mealProvided}
            toggleSwitch={() => setMealProvided(!mealProvided)}
            iconExpo={<MaterialIcons name="restaurant" size={24} color={icon} />}
            text="Repas fourni aux extras"
          />
        </View>
      </ProfileSection>
    </ProfileEditLayout>
  );
}
