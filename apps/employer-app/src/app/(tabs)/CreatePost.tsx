import { FormControl, VStack, Text } from '@koudmain/ui/gluestack';
import { Alert, View, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AppScrollView } from '@/components/layout/AppScrollView';
import LabeledUnderlinedInput from '@/components/form/LabeledUnderlinedInput';
import DurationSlider from '@/components/slider/Slider';
import HorizontalSwitch from '@/components/switch/HorizontalSwitch';
import SelectorMissionPrice from '@/components/selector/SelectorMissionPrice';
import { useCreatePost } from '@/hooks/useCreatePost';
import { CustomButton } from '@/components/button/LongButton';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGetSkillCategory } from '@/hooks/useGetSkillCategory';
import { SearchBarProps } from '@koudmain/ui/components/tools/SearchBar';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { Skill } from '@/types/skill';
import { MissionDatePicker } from '@/components/skill/MissionDuration';
import { MissionSkillSelector } from '@/components/skill/MissionSkillSelector';
import { BottomSheetSkillSelector } from '@/components/skill/BottomSheetSkillSelector';

export default function CreatePost() {
  const [competencesList, setCompetencesList] = useState<Skill[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    mutate_skill_category,
    skills_skill_category,
    isLoading_skill_category,
    error_skill_category,
  } = useGetSkillCategory();

  // Trigger the API fetch when opening the bottom sheet
  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
    void mutate_skill_category();
  }, [mutate_skill_category]);

  // Render the backdrop only when snapPoints change
  const renderBottomSheetBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.2} />
    ),
    [],
  );

  const searchProps: SearchBarProps = {
    value: searchQuery,
    placeholder: 'Rechercher une compétence...',
    onChangeText: (text: string) => {
      setSearchQuery(text);
    },
  };

  const { mutate, isLoading, error } = useCreatePost();
  const [showPicker, setShowPicker] = useState(false);

  // Publication data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timePostString, setTimePostString] = useState<string | null>(null);
  const [duration, setDuration] = useState(4);
  const [paymentType, setPaymentType] = useState('€/h');
  const [amount, setAmount] = useState('');
  const [isPublicationAcceptFirstCandidature, setIsPublicationAcceptFirstCandidature] =
    useState(false);
  const [isPublicationHighlight, setIsPublicationHighlight] = useState(false);
  const [tempSelectedSkills, setTempSelectedSkills] = useState<Skill[]>([]);

  const handleCreatePost = async () => {
    if (!title || !selectedDate || !timePostString || !amount) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
      return;
    }

    const parsedAmount = parseFloat(amount.replace(',', '.')) || 0;
    const rate =
      paymentType === '€/h' ? parsedAmount : parseFloat((parsedAmount / duration).toFixed(2));

    const startObj = new Date(`${selectedDate}T${timePostString}:00`);
    const endObj = new Date(startObj.getTime() + duration * 60 * 60 * 1000);
    const formatLocal = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;

    const payload = {
      title: title,
      description: description,
      hourly_rate: rate,
      starting_date: formatLocal(startObj),
      ending_date: formatLocal(endObj),
      skills: competencesList.map((comp) => comp.id),
      autoAccept: isPublicationAcceptFirstCandidature,
      highlight: isPublicationHighlight,
    };

    const response = await mutate(payload);

    if (response) {
      router.back();
    } else if (error) {
      Alert.alert('Erreur', error);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setTempSelectedSkills([]);
    }
  }, []);

  const onDeleteCompetence = (skillId: number) => {
    setCompetencesList((prev) => prev.filter((comp) => comp.id !== skillId));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppScrollView contentContainerClassName="items-center gap-4 bg-white px-6">
        <View className="w-full flex-row items-center gap-4 pt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-left" size={32} color={'black'} />
          </TouchableOpacity>
          <Text className="text-primary text-3xl font-bold font-inter">Nouvelle Publication</Text>
        </View>
        <View className="w-full h-full pt-4">
          <FormControl>
            <VStack className="gap-6">
              <VStack space="xs" className="w-full gap-2">
                <LabeledUnderlinedInput
                  label="Titre de l'annonce"
                  placeholder="ex: Besoin d'un serveur pour ce samedi soir"
                  containerClassName="mb-6"
                  inputClassName=""
                  value={title}
                  onChangeText={(value) => {
                    setTitle(value);
                  }}
                />
                <LabeledUnderlinedInput
                  label="Description de l'annonce"
                  placeholder="Description de la mission, exigences, etc."
                  containerClassName="h-36"
                  inputClassName=""
                  value={description}
                  onChangeText={(value) => {
                    setDescription(value);
                  }}
                  multiline
                />
              </VStack>
              <VStack space="xs" className="w-full">
                <MissionDatePicker
                  setSelectedDate={setSelectedDate}
                  timePostString={timePostString}
                  setTimePostString={setTimePostString}
                  showPicker={showPicker}
                  setShowPicker={setShowPicker}
                />
              </VStack>
              <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
                <DurationSlider
                  duration={duration}
                  setDuration={setDuration}
                  title="Durée de la mission"
                  sideText="Durée"
                  min={1}
                  max={10}
                  step={0.25}
                />
              </VStack>
              <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
                <SelectorMissionPrice
                  title="Rémunération"
                  paymentType={paymentType}
                  setPaymentType={setPaymentType}
                  paymentOptions={[
                    { label: '€/h', value: '€/h' },
                    { label: 'Forfait', value: 'forfait' },
                  ]}
                  amount={amount}
                  setAmount={setAmount}
                />
              </VStack>
              <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
                <MissionSkillSelector
                  competencesList={competencesList}
                  onDeleteCompetence={onDeleteCompetence}
                  handleOpenBottomSheet={handleOpenBottomSheet}
                />
              </VStack>
              <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
                <HorizontalSwitch
                  isEnabled={isPublicationAcceptFirstCandidature}
                  toggleSwitch={() =>
                    setIsPublicationAcceptFirstCandidature(!isPublicationAcceptFirstCandidature)
                  }
                  iconExpo={<FontAwesome name="question-circle" size={24} color="black" />}
                  text="Accepter automatiquement la première candidature"
                />
                <HorizontalSwitch
                  isEnabled={isPublicationHighlight}
                  toggleSwitch={() => setIsPublicationHighlight(!isPublicationHighlight)}
                  iconExpo={<FontAwesome name="question-circle" size={24} color="black" />}
                  text="Mettre en avant cette annonce"
                />
              </VStack>
              <VStack className="w-full pt-6">
                <CustomButton
                  label={isLoading ? 'Publication en cours...' : 'Publier'}
                  onPress={handleCreatePost}
                />
                {error && <Text className="text-red-500 mt-2 text-center">{error}</Text>}
              </VStack>
            </VStack>
          </FormControl>
        </View>
      </AppScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBottomSheetBackdrop}
        onChange={handleSheetChanges}
        enableDynamicSizing={true}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetSkillSelector
          skills_skill_category={skills_skill_category}
          isLoading_skill_category={isLoading_skill_category}
          error_skill_category={error_skill_category}
          searchQuery={searchQuery}
          searchProps={searchProps}
          tempSelectedSkills={tempSelectedSkills}
          setTempSelectedSkills={setTempSelectedSkills}
          bottomSheetRef={bottomSheetRef}
          setCompetencesList={setCompetencesList}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
