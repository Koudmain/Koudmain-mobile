import { Pressable, Text, View } from 'react-native';

const COMPANY_TYPES = [
  'Café / Bar',
  'Restaurant',
  'Hôtel',
  'Restauration rapide',
  'Traiteur / Event',
  'Autre CHR',
];

interface CompanyTypeSelectorProps {
  value: string | null;
  onChange: (type: string | null) => void;
}

export function CompanyTypeSelector({ value, onChange }: CompanyTypeSelectorProps) {
  return (
    <View className="flex-row flex-wrap justify-between">
      {COMPANY_TYPES.map((type) => {
        const isSelected = value === type;
        return (
          <View key={type} className="w-[48%] mb-2">
            <Pressable
              onPress={() => onChange(isSelected ? null : type)}
              className={`rounded-xl border border-secondary py-4 px-2 items-center justify-center flex-row ${
                isSelected ? 'bg-secondary' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  isSelected ? 'text-white' : 'text-primary dark:text-white'
                }`}
              >
                {type}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
