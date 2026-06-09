import { View, Text, Pressable, Keyboard, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { VStack, FormControl, Button } from '@koudmain/ui/components/ui/index';
import { AuthTop } from '@koudmain/ui/components/auth/AuthTop';

const JOBS = [
  { id: 1, name: 'Plombier' },
  { id: 2, name: 'Électricien' },
  { id: 3, name: 'Maçon' },
  { id: 4, name: 'Menuisier' },
  { id: 5, name: 'Peintre' },
  { id: 6, name: 'Jardinier' },
  { id: 7, name: 'Serrurier' },
  { id: 8, name: 'Mécanicien' },
  { id: 9, name: 'Déménageur' },
];

export default function RegisterJob() {
  const params = useLocalSearchParams<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }>();

  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [bio, setBio] = useState('');

  const toggleJob = (id: number) => {
    if (selectedJobs.includes(id)) {
      setSelectedJobs(selectedJobs.filter((j) => j !== id));
    } else {
      setSelectedJobs([...selectedJobs, id]);
    }
  };

  const isFormValid = selectedJobs.length > 0 && bio.trim().length > 0;

  return (
    <View className="flex-1 bg-white dark:bg-primary h-full">
      <AuthTop title="Inscription" />
      <Pressable onPress={Keyboard.dismiss} className="flex-1">
        <FormControl className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <VStack className="flex flex-col justify-between h-full px-10 pb-10">
              <View className="gap-4 mt-4">
                <Text className="text-primary dark:text-white text-4xl font-bold px-2">
                  Votre profil métier
                </Text>
                <Text className="text-gray-500 dark:text-white mb-6">
                  Sélectionnez vos métiers et ajoutez une description pour votre profil.
                </Text>

                <View className="flex-row flex-wrap gap-3 mt-2">
                  {JOBS.map((job) => {
                    const isSelected = selectedJobs.includes(job.id);
                    return (
                      <Pressable
                        key={job.id}
                        onPress={() => toggleJob(job.id)}
                        className={`px-4 py-2 rounded-full border ${
                          isSelected
                            ? 'bg-secondary-500 border-secondary-500'
                            : 'bg-transparent border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <Text
                          className={`${
                            isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                          } font-semibold`}
                        >
                          {job.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text className="text-primary dark:text-white text-lg font-bold mt-6 px-2">
                  Description
                </Text>
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-primary dark:text-white bg-gray-50 dark:bg-primary-dark"
                  multiline
                  numberOfLines={5}
                  placeholder="Décrivez vos compétences et expériences..."
                  placeholderTextColor="#9ca3af"
                  value={bio}
                  onChangeText={setBio}
                  textAlignVertical="top"
                />
              </View>

              <View className="mt-10">
                <Button
                  label="Continuer"
                  variant={isFormValid ? 'primary' : 'muted'}
                  className="mx-2"
                  disabled={!isFormValid}
                  onPress={() => {
                    router.push({
                      pathname: '/auth/register/RegisterLocation',
                      params: { ...params, selectedJobs: selectedJobs.join(','), bio },
                    });
                  }}
                />
              </View>
            </VStack>
          </ScrollView>
        </FormControl>
      </Pressable>
    </View>
  );
}
