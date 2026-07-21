import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IconButton from '@koudmain/ui/components/utils/IconButton';
import FilterMapModal, { FMapModal } from './FilterMapModal';
import { colors } from '@/constants/theme';

interface MapFilterButtonProps {
  isDark: boolean;
  filters: FMapModal;
  setFilters: (filters: FMapModal) => void;
}

export function MapFilterButton({ isDark, filters, setFilters }: MapFilterButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const activeFiltersCount =
    Number(filters.calendar.active) +
    Number(filters.distance.active) +
    (filters.shortMissionDisplay ? Number(filters.shortMission.active) : 0) +
    (filters.longMissionDisplay ? Number(filters.longMission.active) : 0);
  const hasActiveFilters = activeFiltersCount > 0;

  const buttonBgColor = hasActiveFilters ? 'bg-secondary' : isDark ? 'bg-primary' : 'bg-white';

  const iconColor = hasActiveFilters
    ? colors.secondary.content
    : isDark
      ? colors.primary.content
      : colors.primary.DEFAULT;

  return (
    <>
      <View className="absolute top-4 left-6 z-50">
        <IconButton
          shape="round"
          className={`${buttonBgColor} shadow-lg`}
          icon={
            <MaterialCommunityIcons
              name={hasActiveFilters ? 'filter-check' : 'filter'}
              size={24}
              color={iconColor}
            />
          }
          onPress={() => setIsVisible(true)}
        />

        {hasActiveFilters && (
          <View className="absolute -top-1 -right-1 bg-red-500 min-w-[20px] h-5 rounded-full px-1 justify-center items-center border-2 border-white dark:border-slate-900">
            <Text className="text-white text-[10px] font-bold">{activeFiltersCount}</Text>
          </View>
        )}
      </View>

      <FilterMapModal
        filters={filters}
        setFilters={setFilters}
        isFilterVisible={isVisible}
        setIsFilterVisible={setIsVisible}
      />
    </>
  );
}
