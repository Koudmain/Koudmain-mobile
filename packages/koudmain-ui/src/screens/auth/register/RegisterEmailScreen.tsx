import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import LabeledUnderlinedInput from '../../../components/form/LabeledUnderlinedInput';
import { VStack, FormControl, Button } from '../../../components/ui/index';
import { AuthTop } from '../../../components/auth/AuthTop';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterEmailScreen() {
  const [email, setEmail] = useState('');

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const isFormValid = isEmailValid;
  const emailValidationState =
    trimmedEmail.length === 0 ? 'default' : isEmailValid ? 'success' : 'error';

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
                Veuillez votre adresse e-mail. Nous vous enverrons un code de confirmation.
              </Text>
              <LabeledUnderlinedInput
                label="Email"
                placeholder="contact@exemple.com"
                type="text"
                value={email}
                validationState={emailValidationState}
                onChangeText={(value: string) => {
                  setEmail(value);
                }}
              />
              <View className="flex-row items-center justify-center gap-2 mt-2">
                <Text className="text-gray-400">Vous avez déjà un compte ?</Text>
                <TouchableOpacity onPress={() => router.push('/auth/SignIn')}>
                  <Text className="text-secondary-400 font-bold">Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="mt-10">
              <Button
                label="Continuer"
                variant={isFormValid ? 'primary' : 'muted'}
                className="mx-2"
                disabled={!isFormValid}
                onPress={() =>
                  router.push({
                    pathname: '/auth/register/RegisterPassword',
                    params: { email: trimmedEmail },
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
