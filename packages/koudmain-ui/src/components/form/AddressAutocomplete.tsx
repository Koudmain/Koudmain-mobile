import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, InputField, InputSlot } from '../ui';

export type AddressData = {
  streetNumber?: string;
  streetName: string;
  zipCode: string;
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  displayName: string;
};

interface AddressAutocompleteProps {
  onSelect: (address: AddressData) => void;
  placeholder?: string;
}

export function AddressAutocomplete({
  onSelect,
  placeholder = 'Rechercher une adresse...',
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2 && showDropdown) {
        searchAddress(query);
      } else if (query.length <= 2) {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, showDropdown]);

  const searchAddress = async (text: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5&countrycodes=fr`,
        { headers: { 'User-Agent': 'KoudmainApp/1.0' } },
      );
      const data = await response.json();

      const formattedData = data.map((item: any) => {
        const addr = item.address || {};
        const streetNum = addr.house_number ? `${addr.house_number} ` : '';
        const street = addr.road || addr.pedestrian || '';
        const zip = addr.postcode ? `${addr.postcode} ` : '';
        const city = addr.city || addr.town || addr.village || '';

        const line1 = `${streetNum}${street}`.trim();
        const line2 = `${zip}${city}`.trim();

        let shortName = item.display_name;
        if (line1 && line2) {
          shortName = `${line1}, ${line2}`;
        } else if (line1) {
          shortName = line1;
        } else if (line2) {
          shortName = line2;
        }
        return { ...item, short_name: shortName };
      });

      setResults(formattedData);
    } catch (error) {
      console.error('Erreur recherche adresse:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    setQuery(item.short_name);
    setShowDropdown(false);

    const addressDetails = item.address || {};

    const addressData: AddressData = {
      streetNumber: addressDetails.house_number || '',
      streetName: addressDetails.road || addressDetails.pedestrian || '',
      zipCode: addressDetails.postcode || '',
      city: addressDetails.city || addressDetails.town || addressDetails.village || '',
      country: addressDetails.country || 'France',
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      displayName: item.short_name,
    };

    onSelect(addressData);
  };

  return (
    <View className="relative z-50 w-full mb-2">
      <Input
        variant="underlined"
        size="xl"
        className="rounded-none border-0 border-b-2 border-neutral-300 data-[focus=true]:border-secondary h-12 flex-row items-center"
      >
        <InputField
          placeholder={placeholder}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setShowDropdown(true);
          }}
          allowFontScaling={false}
          className="px-0 font-jakarta text-primary dark:text-white h-12 leading-tight flex-1"
        />
        {loading && (
          <InputSlot className="pr-3">
            <ActivityIndicator size="small" color="#3b82f6" />
          </InputSlot>
        )}
      </Input>

      {showDropdown && results.length > 0 && (
        <View className="absolute top-14 w-full bg-white dark:bg-primary rounded-lg shadow-soft-2 border border-gray-200 dark:border-primary-600 max-h-60 overflow-hidden z-50">
          <ScrollView keyboardShouldPersistTaps="handled">
            {results.map((item) => (
              <TouchableOpacity
                key={item.place_id.toString()}
                className="p-3 border-b border-gray-100 dark:border-primary-600"
                onPress={() => handleSelect(item)}
              >
                <Text className="text-primary dark:text-white" numberOfLines={2}>
                  {item.short_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
