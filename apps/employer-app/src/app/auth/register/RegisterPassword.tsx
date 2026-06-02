import { View, Text, Pressable, Keyboard } from 'react-native';
import { useState } from 'react';

import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { VStack, FormControl, Button } from '@koudmain/ui/gluestack';
import AuthTop from '@/components/auth/AuthTop';
import PasswordChecker, { isPasswordValid } from '@/components/auth/PasswordChecker';

import { router, useLocalSearchParams } from 'expo-router';

export default function RegisterPassword() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string | string[] }>();
  const email = Array.isArray(emailParam) ? (emailParam[0] ?? '') : (emailParam ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordStrong = isPasswordValid(password);
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = isPasswordStrong && doPasswordsMatch;
  const passwordValidationState =
    password.length === 0 ? 'default' : isPasswordStrong ? 'success' : 'error';
  const confirmPasswordValidationState =
    confirmPassword.length === 0 ? 'default' : doPasswordsMatch ? 'success' : 'error';

  return (
    <View className="flex-1 bg-white dark:bg-primary h-full">
      <AuthTop title="Inscription" />
      <Pressable onPress={Keyboard.dismiss} className="flex-1">
        <FormControl className="flex-1">
          <VStack className="flex flex-col justify-around h-full px-10">
            <View className="gap-4">
              <LabeledUnderlinedInput
                label="Mot de passe"
                placeholder="•••••••••••"
                type="password"
                value={password}
                validationState={passwordValidationState}
                onChangeText={(value: string) => {
                  setPassword(value);
                }}
              />
              <PasswordChecker password={password} />
              <LabeledUnderlinedInput
                label="Confirmer le mot de passe"
                placeholder="•••••••••••"
                type="password"
                value={confirmPassword}
                validationState={confirmPasswordValidationState}
                onChangeText={(value: string) => {
                  setConfirmPassword(value);
                }}
              />
            </View>
            <View className="mt-10">
              <Button
                label="Continuer"
                variant={isFormValid ? 'primary' : 'muted'}
                className="mx-2"
                disabled={!isFormValid}
                onPress={() =>
                  router.push({
                    pathname: '/auth/register/RegisterName',
                    params: { email, password },
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
