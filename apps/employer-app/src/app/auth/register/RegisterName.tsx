import { View, Text, Pressable, Keyboard } from 'react-native';
import { useState } from 'react';

import LabeledUnderlinedInput from '@/components/form/LabeledUnderlinedInput';
import { VStack } from '@/components/ui/vstack';
import { FormControl } from '@/components/ui/form-control';
import Button from '@/components/ui/Button';
import AuthTop from '@/components/auth/AuthTop';
import { useSession } from '@/context/SessionContext';
import { router, useLocalSearchParams } from 'expo-router';

export default function RegisterName() {
  const { email: emailParam, password: passwordParam } = useLocalSearchParams<{
    email?: string | string[];
    password?: string | string[];
  }>();
  const email = Array.isArray(emailParam) ? (emailParam[0] ?? '') : (emailParam ?? '');
  const password = Array.isArray(passwordParam) ? (passwordParam[0] ?? '') : (passwordParam ?? '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerFailed, setRegisterFailed] = useState(false);
  const { register, isLoading } = useSession();

  const isFirstNameValid = firstName.trim().length > 0;
  const isLastNameValid = lastName.trim().length > 0;
  const isFormValid = isFirstNameValid && isLastNameValid;
  const passwordValidationState =
    firstName.length === 0 ? 'default' : isFirstNameValid ? 'success' : 'error';
  const confirmPasswordValidationState =
    lastName.length === 0 ? 'default' : isLastNameValid ? 'success' : 'error';

  const handleRegister = async () => {
    try {
      const didRegister = await register(email, password, firstName, lastName, true);
      if (didRegister) {
        router.replace('/auth/SignIn');
        return;
      }

      setRegisterFailed(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Registration failed:', errorMessage);
      setRegisterFailed(true);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-primary h-full">
      <AuthTop title="Inscription" />
      <Pressable onPress={Keyboard.dismiss} className="flex-1">
        <FormControl className="flex-1">
          <VStack className="flex flex-col justify-around h-full px-10">
            <View className="gap-4">
              <Text className="text-primary dark:text-white text-4xl font-bold px-2">
                Créer un compte
              </Text>
              <Text className="text-gray-500 dark:text-white mb-6">
                Presque terminé ! Il ne vous reste plus qu&apos;à nous donner votre nom et prénom.
              </Text>
              <LabeledUnderlinedInput
                label="Prénom"
                placeholder="John"
                type="text"
                value={firstName}
                validationState={passwordValidationState}
                onChangeText={(value) => {
                  setFirstName(value);
                  setRegisterFailed(false);
                }}
              />
              <LabeledUnderlinedInput
                label="Nom"
                placeholder="Doe"
                type="text"
                value={lastName}
                validationState={confirmPasswordValidationState}
                onChangeText={(value) => {
                  setLastName(value);
                  setRegisterFailed(false);
                }}
              />
            </View>
            <View className="mt-10">
              <Button
                label={isLoading ? 'Inscription...' : 'Continuer'}
                variant={isFormValid && !isLoading ? 'primary' : 'muted'}
                className="mx-2"
                disabled={!isFormValid || isLoading}
                onPress={handleRegister}
              />
              {registerFailed && (
                <Text className="text-red-500 text-center mt-4 mx-2">
                  Échec de l&apos;inscription. Merci de réessayer.
                </Text>
              )}
              <Text className="text-gray-400 my-4 mx-2">
                En créant un compte, j&apos;accepte les
                <Text className="text-secondary-400 font-bold">
                  {' '}
                  conditions d&apos;utilisation{' '}
                </Text>
                et la
                <Text className="text-secondary-400 font-bold"> politique de confidentialité </Text>
                de Koudmain.
              </Text>
            </View>
          </VStack>
        </FormControl>
      </Pressable>
    </View>
  );
}
