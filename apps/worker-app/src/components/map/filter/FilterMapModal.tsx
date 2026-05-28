import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CalendarSelector from '@/components/utils/CalendarSelector';
import { useState } from 'react';
import DistanceSelector from '@/components/utils/DistanceSelector';
import { CollapsibleCheckbox } from '../../utils/CollapsibleCheckbox';
import LongMissionFilter from './LongMissionFilter';

interface FilterMapModalProps {
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
}

export default function FilterMapModal({
  isFilterVisible,
  setIsFilterVisible,
}: FilterMapModalProps) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [distance, setDistance] = useState<number>(10);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isFilterVisible}
      onRequestClose={() => setIsFilterVisible(false)}
    >
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="w-[90%] h-[65%] bg-white dark:bg-primary rounded-3xl p-6 shadow-2xl flex-col rounded-[20]">
          <View className="border-b border-gray-100 pb-3 mb-4">
            <Text className="text-xl font-bold text-primary dark:text-white text-center">
              Filtres
            </Text>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <CalendarSelector
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <DistanceSelector
              distance={distance}
              onValuesChange={(dist) => {
                setDistance(dist);
              }}
              className="mt-6"
            />
            <CollapsibleCheckbox label="Mission courte">
              <Text className="text-gray-400">Formulaire pour mission courte...</Text>
            </CollapsibleCheckbox>

            <CollapsibleCheckbox label="Mission longue" initialValue={true}>
              <LongMissionFilter />
            </CollapsibleCheckbox>
          </ScrollView>

          <View className="border-t border-gray-100 pt-4 mt-2">
            <TouchableOpacity
              onPress={() => {
                setIsFilterVisible(false);
              }}
              className="w-full bg-secondary py-3.5 rounded-[10] justify-center items-center shadow-md"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
