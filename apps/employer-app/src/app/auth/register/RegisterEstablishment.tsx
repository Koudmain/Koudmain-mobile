import { View, Text, Pressable, Keyboard, ScrollView } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { AddressAutocomplete, AddressData } from '@koudmain/ui/components/form/AddressAutocomplete';
import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { VStack, FormControl, Button } from '@koudmain/ui/components/ui/index';
import { AuthTop } from '@koudmain/ui/components/auth/AuthTop';

const COMPANY_TYPES = [
  'Café / Bar',
  'Restaurant',
  'Hôtel',
  'Restauration rapide',
  'Traiteur / Event',
  'Autre CHR',
];

export default function RegisterEstablishment() {
  const params = useLocalSearchParams();
  const [companyName, setCompanyName] = useState('');
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const isFormValid =
    companyName.trim().length > 0 && addressData !== null && selectedType !== null;

  return (
    <View className="flex-1 bg-white dark:bg-primary h-full">
      <AuthTop title="Inscription" />
      <Pressable onPress={Keyboard.dismiss} className="flex-1">
        <FormControl className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <VStack className="flex flex-col h-full px-10 pt-4">
              <View className="gap-4">
                <Text className="text-primary dark:text-white text-3xl font-bold px-2 mt-8">
                  Votre établissement
                </Text>
                <Text className="text-gray-500 dark:text-white mb-6">
                  Dites-nous quel type d&apos;établissement vous gérez.
                </Text>

                <LabeledUnderlinedInput
                  label="Nom de l'établissement"
                  placeholder="Bar la Central"
                  type="text"
                  value={companyName}
                  onChangeText={(value: string) => setCompanyName(value)}
                />

                <View className="mt-2">
                  <Text className="text-primary dark:text-white font-inter font-bold text-xl">
                    Lieu (Ville ou Adresse)
                  </Text>
                  <AddressAutocomplete onSelect={(addr) => setAddressData(addr)} />
                </View>

                <View className="mt-4">
                  <Text className="text-primary dark:text-white font-inter font-bold text-xl mb-4">
                    Type d'établissement
                  </Text>
                  <View className="flex-row flex-wrap justify-between">
                    {COMPANY_TYPES.map((type) => {
                      const isSelected = selectedType === type;
                      return (
                        <View key={type} className="w-[48%] mb-2">
                          <Pressable
                            onPress={() => setSelectedType(isSelected ? null : type)}
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
                </View>
              </View>

              <View className="mt-auto pb-10 pt-10">
                <Button
                  label="Continuer"
                  variant={isFormValid ? 'primary' : 'muted'}
                  className="mx-2"
                  disabled={!isFormValid}
                  onPress={() =>
                    router.push({
                      pathname: '/auth/register/RegisterNeeds',
                      params: {
                        ...params,
                        companyName: companyName,
                        companyType: selectedType,
                        streetNumber: addressData?.streetNumber || '',
                        streetName: addressData?.streetName || '',
                        zipCode: addressData?.zipCode || '',
                        city: addressData?.city || '',
                        country: addressData?.country || 'France',
                        latitude: addressData?.latitude?.toString() || '',
                        longitude: addressData?.longitude?.toString() || '',
                      },
                    })
                  }
                />
                <Text className="text-gray-400 my-4 mx-2">
                  En créant un compte, j&apos;accepte les
                  <Text className="text-secondary-400 font-bold">
                    {' '}
                    conditions d&apos;utilisation{' '}
                  </Text>
                  et la
                  <Text className="text-secondary-400 font-bold">
                    {' '}
                    politique de confidentialité{' '}
                  </Text>
                  de Koudmain.
                </Text>
              </View>
            </VStack>
          </ScrollView>
        </FormControl>
      </Pressable>
    </View>
  );
}
