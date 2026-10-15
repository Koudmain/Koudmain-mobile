import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { useGetWorkerProfile } from '@koudmain/ui/hooks/useGetWorkerProfile';
import { ProfileEditLayout, ProfileLoadState, ProfileSection } from '@koudmain/ui/components';
import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { AddressAutocomplete, AddressData } from '@koudmain/ui/components/form/AddressAutocomplete';
import CompetenceCardSelectable from '@koudmain/ui/components/card/CompetenceCardSelectable';
import DistanceSlider from '@koudmain/ui/components/utils/DistanceSlider';
import { profileService, skillCategoryService, SkillCategory, userService } from '@koudmain/ui/api';
import { IWorkerProfile } from '@koudmain/ui/types';
import { ExperienceDraft, ExperiencesEditor } from '@/components/profile/ExperiencesEditor';
import { FormationDraft, FormationsEditor } from '@/components/profile/FormationsEditor';

const hasChanged = <T,>(current: T[], initial: T[]) =>
  JSON.stringify(current) !== JSON.stringify(initial);

export default function EditMyProfilePage() {
  const { session } = useSession();
  const { workerProfile, errorWorkerProfile, refetchWorkerProfile } = useGetWorkerProfile(
    session,
    'me',
  );

  if (!workerProfile) {
    return <ProfileLoadState error={errorWorkerProfile} onRetry={refetchWorkerProfile} />;
  }

  return <WorkerProfileForm worker={workerProfile} />;
}

function WorkerProfileForm({ worker }: { worker: IWorkerProfile }) {
  const { session, refreshUser } = useSession();
  const [firstName, setFirstName] = useState(worker.user.first_name);
  const [lastName, setLastName] = useState(worker.user.last_name);
  const [pictureUri, setPictureUri] = useState<string | null>(null);
  const [bio, setBio] = useState(worker.bio ?? '');
  const [skillIds, setSkillIds] = useState(worker.skills.map((skill) => skill.id));
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [workRadius, setWorkRadius] = useState(worker.workRadius ?? 20);
  const [initialExperiences] = useState<ExperienceDraft[]>(() =>
    worker.experiences.map(({ title, durationMonths }) => ({
      title,
      durationMonths: durationMonths ? String(durationMonths) : '',
    })),
  );
  const [initialFormations] = useState<FormationDraft[]>(() =>
    worker.formations.map(({ title, institution, type, obtainedDate }) => ({
      title,
      institution: institution ?? '',
      type,
      year: obtainedDate ? obtainedDate.slice(0, 4) : '',
      savedDate: obtainedDate,
    })),
  );
  const [experiences, setExperiences] = useState(initialExperiences);
  const [formations, setFormations] = useState(initialFormations);
  const [isAddressTyped, setIsAddressTyped] = useState(false);

  useEffect(() => {
    skillCategoryService
      .getAll()
      .then(setSkillCategories)
      .catch((error) => console.error('Erreur lors du chargement des métiers:', error));
  }, []);

  const isAddressValid = !address || (!!address.streetName && !!address.zipCode && !!address.city);
  const canSave =
    isAddressValid &&
    !isAddressTyped &&
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    skillIds.length > 0 &&
    workRadius >= 1 &&
    workRadius <= 500 &&
    experiences.every((experience) => experience.title.trim()) &&
    formations.every(
      (formation) => formation.title.trim() && [0, 4].includes(formation.year.length),
    );

  const pickPicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) setPictureUri(result.assets[0].uri);
    } catch (error) {
      console.error(error);
      alert("Impossible d'ouvrir votre galerie photo.");
    }
  };

  const toggleSkill = (id: number, selected: boolean) =>
    setSkillIds((ids) => (selected ? [...ids, id] : ids.filter((skillId) => skillId !== id)));

  const handleSave = async () => {
    if (!session) return false;

    try {
      const hasIdentityChanged =
        firstName !== worker.user.first_name || lastName !== worker.user.last_name || !!pictureUri;
      if (hasIdentityChanged) {
        await userService.updateProfile(session, {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          imageUri: pictureUri,
        });
        await refreshUser();
      }

      await profileService.updateMyWorkerProfile(session, {
        bio: bio.trim(),
        workRadius,
        skillCategoryIds: skillIds,
        experiences: hasChanged(experiences, initialExperiences)
          ? experiences.map(({ title, durationMonths }) => ({
              title: title.trim(),
              durationMonths: Number(durationMonths) || undefined,
            }))
          : undefined,
        formations: hasChanged(formations, initialFormations)
          ? formations.map(({ title, institution, type, year, savedDate }) => ({
              title: title.trim(),
              institution: institution.trim() || undefined,
              type: type ?? undefined,
              obtainedDate: !year
                ? undefined
                : savedDate?.startsWith(year)
                  ? savedDate
                  : `${year}-01-01`,
            }))
          : undefined,
        address: address ?? undefined,
      });

      return true;
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement de votre profil.");
      return false;
    }
  };

  const pictureSource = pictureUri ?? worker.user.profile_picture_url;

  return (
    <ProfileEditLayout title="Modifier mon profil" canSave={canSave} onSave={handleSave}>
      <TouchableOpacity onPress={pickPicture} className="items-center mt-6" activeOpacity={0.8}>
        <View className="w-24 h-24 rounded-full overflow-hidden bg-secondary-50">
          {pictureSource ? (
            <Image source={{ uri: pictureSource }} className="w-full h-full" />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-3xl font-bold text-secondary">{firstName.charAt(0)}</Text>
            </View>
          )}
        </View>
        <Text className="mt-2 text-sm font-semibold text-secondary">Modifier la photo</Text>
      </TouchableOpacity>

      <LabeledUnderlinedInput
        label="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        containerClassName="mt-6"
      />
      <LabeledUnderlinedInput
        label="Nom"
        value={lastName}
        onChangeText={setLastName}
        containerClassName="mt-6"
      />

      <LabeledUnderlinedInput
        label="À propos de moi"
        placeholder="Présentez-vous en quelques mots..."
        value={bio}
        onChangeText={setBio}
        multiline
        containerClassName="mt-6"
      />

      <ProfileSection title="Compétences">
        <View className="flex-row flex-wrap">
          {skillCategories.map((category) => (
            <CompetenceCardSelectable
              key={category.id}
              comp={category.name}
              size="lg"
              defaultSelected={skillIds.includes(category.id)}
              onChange={(selected) => toggleSkill(category.id, selected)}
            />
          ))}
        </View>
      </ProfileSection>

      <ProfileSection title="Ville">
        <AddressAutocomplete
          defaultValue={worker.address?.city ?? ''}
          placeholder="Rechercher votre adresse..."
          onChangeText={(text) => {
            setAddress(null);
            setIsAddressTyped(text !== (worker.address?.city ?? ''));
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
        <DistanceSlider
          title="Rayon de recherche"
          distance={workRadius}
          distanceMin={1}
          distanceMax={50}
          onValuesChange={setWorkRadius}
          className="mt-4"
        />
      </ProfileSection>

      <ProfileSection title="Expériences">
        <ExperiencesEditor experiences={experiences} onChange={setExperiences} />
      </ProfileSection>

      <ProfileSection title="Formations">
        <FormationsEditor formations={formations} onChange={setFormations} />
      </ProfileSection>
    </ProfileEditLayout>
  );
}
