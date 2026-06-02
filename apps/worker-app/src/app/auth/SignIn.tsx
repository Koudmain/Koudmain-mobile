import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { useState } from 'react';

import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { VStack, FormControl, Button, Divider } from '@koudmain/ui';
import AuthTop from '@/components/auth/AuthTop';

import { router } from 'expo-router';
import GoogleIcon from '@/assets/svg/google-24px.svg';
import { useSession } from '@/context/SessionContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useSession();
  const [signinFailed, setSigninFailed] = useState(false);

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const isFormValid = isEmailValid && password.trim() !== '';
  const emailValidationState =
    trimmedEmail.length === 0 ? 'default' : isEmailValid ? 'success' : 'error';

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Sign-in failed:', errorMessage);
      setSigninFailed(true);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <AuthTop title="Connexion" />
      <Pressable onPress={Keyboard.dismiss} className="flex-1 mt-10">
        <FormControl>
          <VStack className="gap-4 px-12 mt-12">
            <LabeledUnderlinedInput
              label="Email"
              placeholder="contact@exemple.com"
              type="text"
              value={email}
              validationState={emailValidationState}
              onChangeText={(value) => {
                setEmail(value);
                setSigninFailed(false);
              }}
            />
            <LabeledUnderlinedInput
              label="Mot de passe"
              placeholder="•••••••••••"
              type="password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setSigninFailed(false);
              }}
            />
            <Text className="text-secondary-400 text-right font-bold">Mot de passe oublié ?</Text>
            <Button
              label={isLoading ? 'Connexion...' : 'Se connecter'}
              variant={isFormValid && !isLoading ? 'primary' : 'muted'}
              className="mx-2 mt-24"
              disabled={!isFormValid || isLoading}
              onPress={handleSignIn}
            />
            {signinFailed && (
              <Text className="text-red-500 text-center mt-4">
                Échec de la connexion. Veuillez vérifier vos identifiants.
              </Text>
            )}
            <View className="flex-row items-center justify-between ">
              <Divider className="my-12 ml-12 bg-gray-400 w-1/4" />
              <Text className="text-gray-400 font-bold">OU</Text>
              <Divider className="my-12 mr-12 bg-gray-400 w-1/4" />
            </View>
            <Button
              icon={GoogleIcon}
              label="Connection avec Google"
              variant="outline"
              className="mx-2"
              onPress={() => {
                router.push('/auth/register/RegisterEmail');
              }}
            />
            <View className="flex-row items-center justify-center gap-2 mt-10">
              <Text className="text-gray-400">Vous n&apos;avez pas de compte ?</Text>
              <TouchableOpacity onPress={() => router.push('/auth/register/RegisterEmail')}>
                <Text className="text-secondary-400 font-bold">S&apos;inscrire</Text>
              </TouchableOpacity>
            </View>
          </VStack>
        </FormControl>
      </Pressable>
    </View>
  );
}
