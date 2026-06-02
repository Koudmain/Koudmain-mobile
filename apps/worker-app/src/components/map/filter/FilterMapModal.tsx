import { Modal, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import DistanceSlider from '@/components/utils/DistanceSlider';
import { CollapsibleCheckbox } from '@/components/utils/CollapsibleCheckbox';
import LongMissionFilter, {
  FLongMissionFilter,
  defaultLongMissionFilter,
} from '@/components/map/filter/long-mission/LongMissionFilter';
import ShortMissionFilter, {
  FShortMissionFilter,
  defaultShortMissionFilter,
} from '@/components/map/filter/ShortMissionFilter';
import Divider from '@/components/utils/Divider';
import { colors } from '@/constants/theme';
import CalendarFilter, { FCalendarSelector, defaultFCalendarSelector } from './CalendarFilter';

export interface FDistanceSlider {
  distance: number;
  active: boolean;
}

export const defaultFDistanceSlider: FDistanceSlider = {
  distance: 10,
  active: false,
};

export interface FMapModal {
  shortMissionDisplay: boolean;
  longMissionDisplay: boolean;
  shortMission: FShortMissionFilter;
  longMission: FLongMissionFilter;
  calendar: FCalendarSelector;
  distance: FDistanceSlider;
}

export const defaultFMapModal: FMapModal = {
  shortMissionDisplay: true,
  longMissionDisplay: true,
  shortMission: defaultShortMissionFilter,
  longMission: defaultLongMissionFilter,
  calendar: defaultFCalendarSelector,
  distance: defaultFDistanceSlider,
};

interface FilterMapModalProps {
  filters: FMapModal;
  setFilters: (filters: FMapModal) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
}

export default function FilterMapModal({
  filters,
  setFilters,
  isFilterVisible,
  setIsFilterVisible,
}: FilterMapModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { calendar, distance, shortMission, longMission } = filters;

  const handleChangeDistance = (distance: number) => {
    setFilters({
      ...filters,
      distance: {
        ...filters.distance,
        distance,
        active: distance !== defaultFDistanceSlider.distance,
      },
    });
  };

  const handleChangeMissionDisplay = (
    key: 'shortMissionDisplay' | 'longMissionDisplay',
    value: boolean,
  ) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

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

          <ScrollView className="flex flex-1 w-full" showsVerticalScrollIndicator={false}>
            <CalendarFilter
              calendar={calendar}
              setCalendar={(calendar) => setFilters({ ...filters, calendar })}
            />
            <Divider
              className="my-6 w-[90%] self-center"
              color={isDark ? colors.primary[400] : colors.primary[50]}
              thickness={1}
            />
            <DistanceSlider
              title="Distance de recherche"
              distance={distance.distance}
              distanceMin={0}
              distanceMax={100}
              unit="km"
              onValuesChange={(dist) => {
                handleChangeDistance(dist);
              }}
            />
            <Divider
              className="my-4 w-[90%] self-center"
              color={isDark ? colors.primary[400] : colors.primary[50]}
              thickness={1}
            />
            <CollapsibleCheckbox
              label="Mission courte"
              checked={filters.shortMissionDisplay}
              onChange={(value) => handleChangeMissionDisplay('shortMissionDisplay', value)}
            >
              <ShortMissionFilter
                filters={shortMission}
                setFilters={(shortMission) => setFilters({ ...filters, shortMission })}
              />
            </CollapsibleCheckbox>

            <CollapsibleCheckbox
              label="Mission longue"
              checked={filters.longMissionDisplay}
              onChange={(value) => handleChangeMissionDisplay('longMissionDisplay', value)}
            >
              <LongMissionFilter
                filters={longMission}
                setFilters={(longMission) => setFilters({ ...filters, longMission })}
              />
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
