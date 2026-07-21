import React from 'react';
import { ScrollView, View } from 'react-native';
import FilterChip from '@koudmain/ui/components/card/FilterChipCard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type FiltersOffersProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

function FiltersOffers({ selectedIds, onChange }: FiltersOffersProps) {
  const categories = [
    {
      id: 'cuisine',
      label: 'Cuisine',
      icon: MaterialCommunityIcons,
      iconName: 'silverware-clean',
    },
    { id: 'bar', label: 'Bar', icon: MaterialCommunityIcons, iconName: 'beer' },
    {
      id: 'service',
      label: 'Service',
      icon: MaterialIcons,
      iconName: 'restaurant',
    },
    {
      id: 'plonge',
      label: 'Plonge',
      icon: MaterialCommunityIcons,
      iconName: 'dishwasher-alert',
    },
  ];

  return (
    <View className="flex-row py-2 px-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.label}
            iconLibrary={cat.icon}
            iconName={cat.iconName}
            isActive={selectedIds.includes(cat.id)}
            onPress={() =>
              onChange(
                selectedIds.includes(cat.id)
                  ? selectedIds.filter((id) => id !== cat.id)
                  : [...selectedIds, cat.id],
              )
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default FiltersOffers;
