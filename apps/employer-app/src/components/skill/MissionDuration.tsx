import React from 'react';
import { Text } from '@koudmain/ui/gluestack';
import { View } from 'react-native';
import { CustomButton } from '@/components/button/LongButton';
import CalendarStrip from 'react-native-calendar-strip';
import { TimerPickerModal } from 'react-native-timer-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/constants/theme';
import { formatTime } from '@koudmain/ui/utils/formatTime';

export interface MissionDurationPickerProps {
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  timePostString: string | null;
  setTimePostString: React.Dispatch<React.SetStateAction<string | null>>;
  showPicker: boolean;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MissionDatePicker({
  setSelectedDate,
  timePostString,
  setTimePostString,
  showPicker,
  setShowPicker,
}: MissionDurationPickerProps) {
  return (
    <View>
      <Text className="text-primary font-inter font-bold text-xl">Début de la mission</Text>
      <View className="pt-5 pb-2.5 bg-surface h-auto rounded-lg">
        <CalendarStrip
          scrollable
          style={{ height: 120 }}
          calendarColor={'transparent'}
          calendarHeaderFormat={'MMMM YYYY'}
          calendarHeaderPosition={'above'}
          calendarHeaderStyle={{ color: colors.primary.DEFAULT, fontFamily: 'Inter' }}
          dateNumberStyle={{
            color: colors.primary.DEFAULT,
            fontSize: 24,
            fontFamily: 'Inter',
            fontWeight: 'bold',
          }}
          dateNameStyle={{ color: colors.grey, fontFamily: 'Inter', fontSize: 12 }}
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
          <Text className="text-primary font-inter font-bold font-size-16">{timePostString}</Text>
        ) : (
          <Text className="text-primary font-inter font-bold font-size-16">HH:MM</Text>
        )}
      </View>
    </View>
  );
}
