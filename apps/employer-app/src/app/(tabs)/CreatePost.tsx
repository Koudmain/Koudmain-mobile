import { Input, InputField } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Switch } from '@/components/ui/switch';
import CalendarStrip from 'react-native-calendar-strip';
import React, { useState } from 'react';
import { TimerPickerModal } from 'react-native-timer-picker';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { ChevronDownIcon } from '@/components/ui/icon/ChevronDownIcon';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@/components/ui/select';
import { AppScrollView } from '@/components/layout/AppScrollView';
import CompetenceCard from '@/components/Competences';
import { colors } from '@/constants/theme';

interface CustomButtonProps {
  label: string;
  onPress?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.customButtonContainer}>
      <LinearGradient
        style={styles.customButtonGradient}
        colors={['#D84A22', '#FF6E40']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.customButtonText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customButtonContainer: {
    marginHorizontal: 5,
  },
  customButtonGradient: {
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

const formatTime = ({ hours, minutes }: { hours?: number; minutes?: number }) => {
  const timeParts = [];

  if (hours !== undefined) {
    timeParts.push(hours.toString().padStart(2, '0'));
  }
  if (minutes !== undefined) {
    timeParts.push(minutes.toString().padStart(2, '0'));
  }
  return timeParts.join(':');
};

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration);
  const minutes = (duration - hours) * 60;
  return `${hours}h ${minutes > 0 ? `${minutes}min` : '00min'}`;
};

interface Competence {
  name1: string;
  name2: string;
}

const competencesList: Competence[] = [
  { name1: 'Barman', name2: 'Serveur' },
  { name1: 'Cuisinier', name2: 'Pâtissier' },
  { name1: 'Plongeur', name2: 'Commis de cuisine' },
];

export default function CreatePost() {
  const [, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [timePostString, setTimePostString] = useState<string | null>(null);
  const [duration, setDuration] = useState(4);
  const [paymentType, setPaymentType] = useState('€/h');

  return (
    <AppScrollView contentContainerClassName="items-center gap-4 bg-white pt-20 px-6">
      <View>
        <Text className="text-primary text-4xl font-bold font-inter">Nouvelle Publication</Text>
      </View>
      <View className="w-full h-full pt-4">
        <FormControl>
          <VStack className="gap-4">
            <VStack space="xs">
              <Text className="text-primary font-inter font-bold text-xl">Titre</Text>
              <Input variant="underlined" isFocused={false} size="xl">
                <InputField
                  type="text"
                  className="font-jakarta text-primary"
                  placeholder="Ecrivez le titre du post ici..."
                />
              </Input>
            </VStack>
            <VStack space="xs">
              <Text className="text-primary font-inter font-bold text-xl">Description</Text>
              <Input variant="underlined" isFocused={false} size="xl" className="h-32">
                <InputField
                  type="text"
                  className="font-jakarta text-primary h-full"
                  placeholder="Décrivez votre post ici.."
                  multiline={true}
                />
              </Input>
            </VStack>
            <VStack space="xs" className="w-full">
              <Text className="text-primary font-inter font-bold text-xl">Date & Heure</Text>
              <View className="pt-5 pb-2.5 bg-surface h-auto rounded-lg">
                <CalendarStrip
                  scrollable
                  style={{ height: 120 }}
                  calendarColor={'transparent'}
                  calendarHeaderFormat={'MMMM YYYY'}
                  calendarHeaderPosition={'above'}
                  calendarHeaderStyle={{
                    color: colors.primary.DEFAULT,
                    fontFamily: 'Inter',
                  }}
                  dateNumberStyle={{
                    color: colors.primary.DEFAULT,
                    fontSize: 24,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                  }}
                  dateNameStyle={{
                    color: colors.grey,
                    fontFamily: 'Inter',
                    fontSize: 12,
                  }}
                  highlightDateNameStyle={{
                    color: colors.black,
                    fontSize: 12,
                    fontFamily: 'Inter',
                  }}
                  highlightDateNumberStyle={{
                    color: 'white',
                    fontSize: 24,
                    fontFamily: 'Inter',
                    backgroundColor: colors.secondary.DEFAULT,
                    borderRadius: 5,
                    paddingHorizontal: 3,
                    overflow: 'hidden',
                  }}
                  onDateSelected={(date) => {
                    setSelectedDate(date.format('YYYY-MM-DD'));
                    setShowPicker(true);
                  }}
                  iconContainer={{ flex: 0.01 }}
                  iconStyle={{ display: 'none' }}
                />
              </View>
              <TimerPickerModal
                closeOnOverlayPress
                modalProps={{
                  overlayOpacity: 0.2,
                }}
                hourLabel="h"
                minuteLabel="min"
                hideSeconds
                modalTitle="Heure de début"
                onCancel={() => setShowPicker(false)}
                onConfirm={(pickedDate) => {
                  setShowPicker(false);
                  setTimePostString(formatTime(pickedDate));
                }}
                setIsVisible={setShowPicker}
                cancelButton={<CustomButton label="Cancel" />}
                confirmButton={<CustomButton label="Confirm" />}
                visible={showPicker}
                styles={{
                  theme: 'light',
                  pickerLabelGap: 8,
                  pickerItem: {
                    fontSize: 34,
                  },
                  pickerLabel: {
                    fontSize: 26,
                  },
                  pickerContainer: {
                    paddingHorizontal: 20,
                    marginHorizontal: 20,
                  },
                  pickerColumnWidth: {
                    hours: 50,
                    minutes: 150,
                  },
                }}
              />
              <View className="pt-3 flex-row items-center gap-2">
                <MaterialCommunityIcons name="clock" size={24} color="black" />
                {timePostString !== null ? (
                  <Text className="text-primary font-inter font-bold font-size-16">
                    {timePostString}
                  </Text>
                ) : (
                  <Text className="text-primary font-inter font-bold font-size-16">HH:MM</Text>
                )}
              </View>
            </VStack>
            <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
              <Text className="text-primary font-inter font-bold text-xl">Durée</Text>
              <View className="w-full pt-3 flex-row items-center gap-2">
                <MaterialCommunityIcons name="clock" size={24} color="black" />
                <Text className="text-primary font-inter font-bold font-size-16 min-w-20">
                  {formatDuration(duration)}
                </Text>
                <Slider
                  style={{ width: 200, height: 60, paddingLeft: 10 }}
                  minimumValue={1}
                  maximumValue={10}
                  minimumTrackTintColor="#D84A22"
                  maximumTrackTintColor="primary"
                  step={0.5}
                  value={duration}
                  onValueChange={(value) => setDuration(value)}
                  thumbTintColor={colors.secondary.DEFAULT}
                />
              </View>
            </VStack>
            <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-primary font-inter font-bold text-xl">Rémunération</Text>
                <FontAwesome name="question-circle" size={24} color="black" />
              </View>
              <View className="flex-row items-center pt-3 gap-3">
                <FontAwesome5 name="money-check-alt" size={24} color="black" />
                <Input className="flex-1" variant="outline" isFocused={false} size="xl">
                  <InputField
                    type="text"
                    className="font-jakarta font-bold font-size-16 text-right"
                    placeholder="ex: 13.00"
                    keyboardType="decimal-pad"
                  />
                </Input>
                <Select
                  selectedValue={paymentType}
                  onValueChange={(value) => setPaymentType(value)}
                >
                  <SelectTrigger variant="outline" size="xl" className="flex-1 min-w-0 mr-3">
                    <SelectInput
                      placeholder="Choisir son forfait"
                      value={paymentType}
                      numberOfLines={1}
                    />
                    <SelectIcon as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="€/h" value="€/h" />
                      <SelectItem label="€/mission" value="€/mission" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </View>
            </VStack>
            <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
              <Text className=" mb-3 font-inter font-bold text-primary text-xl">Compétences</Text>
              <View className="flex-row flex-wrap gap-2">
                {competencesList.map((competence, index) => (
                  <View key={index} className="">
                    {CompetenceCard({ comp: competence.name1, size: 'lg' })}
                    {CompetenceCard({ comp: competence.name2, size: 'lg' })}
                  </View>
                ))}
              </View>
            </VStack>
            <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
              <Text className="text-primary font-inter font-bold text-xl">Ajouter une image</Text>
              <TouchableOpacity className="w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mt-3">
                <FontAwesome name="plus" size={24} color="gray" />
                <Text className="text-gray-400 mt-2">Ajouter une image</Text>
              </TouchableOpacity>
            </VStack>
            <VStack space="xs" className="w-full border-t border-gray-200 pt-4">
              <View className="flex-row items-center gap-2 w-full">
                <Switch
                  size="md"
                  isDisabled={false}
                  trackColor={{
                    false: colors.primary.DEFAULT,
                    true: colors.secondary.DEFAULT,
                  }}
                  thumbColor="#fafafa"
                  ios_backgroundColor="#d4d4d4"
                />
                <FontAwesome name="question-circle" size={24} color="black" />
                <Text
                  className="text-primary font-inter text-md flex-1"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Accepter automatiquement la première candidature
                </Text>
              </View>
              <View className="flex-row items-center gap-2 w-full mt-3">
                <Switch
                  size="md"
                  isDisabled={false}
                  trackColor={{
                    false: colors.primary.DEFAULT,
                    true: colors.secondary.DEFAULT,
                  }}
                  thumbColor="#fafafa"
                  ios_backgroundColor="#d4d4d4"
                />
                <FontAwesome name="question-circle" size={24} color="black" />
                <Text className="text-primary font-inter text-md" isTruncated={true}>
                  Mettre en avant cette annonce
                </Text>
              </View>
            </VStack>
            <VStack className="w-full pt-6">
              <CustomButton label="Publier" onPress={() => {}} />
            </VStack>
          </VStack>
        </FormControl>
      </View>
    </AppScrollView>
  );
}
