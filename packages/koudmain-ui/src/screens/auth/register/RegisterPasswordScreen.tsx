import { View, Text, Pressable, Keyboard } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import LabeledUnderlinedInput from '../../../components/form/LabeledUnderlinedInput';
import { VStack, FormControl, Button } from '../../../components/ui/index';
import { AuthTop } from '../../../components/auth/AuthTop';
import { PasswordChecker, isPasswordValid } from '../../../components/auth/PasswordChecker';

import { useSession } from '@koudmain/ui/context/SessionContext';

type RegisterPasswordScreenProps = {
  appContext: 'employer' | 'worker';
};

export function RegisterPasswordScreen({ appContext }: RegisterPasswordScreenProps) {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const email = Array.isArray(params.email) ? (params.email[0] ?? '') : (params.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerFailed, setRegisterFailed] = useState(false);
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
      const getParam = (key: string) => Array.isArray(params[key]) ? params[key][0] : params[key] as string;

      const userId = await register({
        email,
        password,
        firstName: getParam('firstName') || '',
        lastName: getParam('lastName') || '',
        role: appContext === 'employer' ? 'EMPLOYER' : 'WORKER',
        workerProfile: appContext === 'worker' ? {
          skill_category_id: parseInt(getParam('selectedJobs')?.split(',')[0] || '1', 10),
          bio: getParam('bio'),
          work_radius: parseInt(getParam('radius') || '10', 10),
          address: getParam('street_name') ? {
            street_number: getParam('street_number') || undefined,
            street_name: getParam('street_name') || '',
            zip_code: getParam('zip_code') || '',
            city: getParam('city') || '',
            country: getParam('country') || 'France',
            latitude: parseFloat(getParam('latitude') || '0'),
            longitude: parseFloat(getParam('longitude') || '0'),
          } : undefined,
        } : undefined,
        employerProfile: appContext === 'employer' ? {
          company_name: 'Mock Company',
          owner_position: 'OWNER',
          desired_trade_ids: [1],
        } : undefined,
      });

      if (userId) {
        router.push({
          pathname: '/auth/register/RegisterVerificationCode',
          params: { userId: userId.toString(), email },
        });
        return;
      }
      setRegisterFailed(true);
    } catch (error) {
      console.error('Registration failed:', error);
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
              <LabeledUnderlinedInput
                label="Mot de passe"
                placeholder="•••••••••••"
                type="password"
                value={password}
                validationState={passwordValidationState}
                onChangeText={(value: string) => {
                  setPassword(value);
                  setRegisterFailed(false);
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
                  setRegisterFailed(false);
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
              {registerFailed && (
                <Text className="text-red-500 text-center mt-4 mx-2">
                  Échec de l'inscription. Merci de réessayer.
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
