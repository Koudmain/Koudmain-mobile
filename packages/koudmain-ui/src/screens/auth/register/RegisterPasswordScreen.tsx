import { View, Text, Pressable, Keyboard, Alert } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { VStack, FormControl, Button } from '@koudmain/ui/components/ui/index';
import { AuthTop } from '@koudmain/ui/components/auth/AuthTop';
import { PasswordChecker, isPasswordValid } from '@koudmain/ui/components/auth/PasswordChecker';

import { useSession } from '@koudmain/ui/context/SessionContext';
import { buildRegisterData } from '@koudmain/ui/utils/buildRegisterData';

type RegisterPasswordScreenProps = {
  appContext: 'employer' | 'worker';
};

export function RegisterPasswordScreen({ appContext }: RegisterPasswordScreenProps) {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const email = Array.isArray(params.email) ? (params.email[0] ?? '') : (params.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useSession();

  const isPasswordStrong = isPasswordValid(password);
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = isPasswordStrong && doPasswordsMatch;
  const passwordValidationState =
    password.length === 0 ? 'default' : isPasswordStrong ? 'success' : 'error';
  const confirmPasswordValidationState =
    confirmPassword.length === 0 ? 'default' : doPasswordsMatch ? 'success' : 'error';

  const handleRegister = async () => {
    try {
      const userId = await register({
        ...buildRegisterData(params, appContext),
        email,
        password,
      });

      if (userId) {
        router.push({
          pathname: '/auth/register/RegisterVerificationCode',
          params: { userId: userId.toString(), email },
        });
        return;
      }
      Alert.alert('Erreur', "Échec de l'inscription. Merci de réessayer.");
    } catch (error) {
      const err = error as Error;
      console.error('Registration failed:', err);
      Alert.alert('Erreur', err.message || "Échec de l'inscription. Merci de réessayer.");
    }
  };

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
                label={isLoading ? 'Inscription...' : 'Terminer'}
                variant={isFormValid && !isLoading ? 'primary' : 'muted'}
                className="mx-2"
                disabled={!isFormValid || isLoading}
                onPress={handleRegister}
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
