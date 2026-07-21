import {
  View,
  Text,
  Pressable,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { FormControl, Button } from '@koudmain/ui/components/ui/index';
import { AuthTop } from '@koudmain/ui/components/auth/AuthTop';
import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { skillCategoryService, SkillCategory } from '@koudmain/ui/api';
import CompetenceCardSelectable from '@koudmain/ui/components/card/CompetenceCardSelectable';

export default function RegisterJob() {
  const params = useLocalSearchParams<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
  }>();

  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [bio, setBio] = useState('');
  const [jobs, setJobs] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const categories = await skillCategoryService.getAll();
        setJobs(categories);
      } catch (err) {
        Alert.alert('Erreur', 'Erreur lors du chargement des métiers.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobChange = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedJobs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setSelectedJobs((prev) => prev.filter((j) => j !== id));
    }
  };

  const isFormValid = selectedJobs.length > 0 && bio.trim().length > 0;

  return (
    <View className="flex-1 bg-white dark:bg-primary h-full">
      <AuthTop title="Inscription" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
        className="flex-1"
      >
        <Pressable onPress={Keyboard.dismiss} className="flex-1">
          <FormControl className="flex-1">
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-4 mt-4 px-10">
                <Text className="text-primary dark:text-white text-4xl font-bold mt-10 mb-2">
                  Votre profil métier
                </Text>
                <Text className="text-gray-500 dark:text-white mb-6">
                  Sélectionnez vos métiers et ajoutez une description pour votre profil.
                </Text>

                {loading ? (
                  <View className="py-4">
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                ) : (
                  <View className="flex-row flex-wrap mt-2">
                    {jobs.map((job) => {
                      return (
                        <View key={job.id} className="mb-3">
                          <CompetenceCardSelectable
                            comp={job.name}
                            onChange={(selected) => handleJobChange(job.id, selected)}
                            size="lg"
                          />
                        </View>
                      );
                    })}
                  </View>
                )}

                <LabeledUnderlinedInput
                  label="Description"
                  placeholder="Décrivez vos compétences et expériences..."
                  value={bio}
                  onChangeText={setBio}
                  multiline
                />
              </View>

              <View className="mt-auto px-10 pb-10 pt-32">
                <Button
                  label="Continuer"
                  variant={isFormValid ? 'primary' : 'muted'}
                  disabled={!isFormValid}
                  onPress={() =>
                    router.push({
                      pathname: '/auth/register/RegisterLocation',
                      params: { ...params, selectedJobs: selectedJobs.join(','), bio },
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
            </ScrollView>
          </FormControl>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}
