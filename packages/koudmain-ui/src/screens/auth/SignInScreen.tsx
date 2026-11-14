import { View, Text, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SvgProps } from 'react-native-svg';

import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { VStack, FormControl, Button, Divider } from '@koudmain/ui/components/ui/index';
import { AuthTop } from '@koudmain/ui/components/auth/AuthTop';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { GoogleAccount, getGoogleAccount } from '@koudmain/ui/utils/googleSignIn';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WRONG_ROLE_MESSAGE = "Ce compte n'est pas autorisé sur cette application.";

type SignInScreenProps = {
  googleIcon?: React.FC<SvgProps>;
};

export function SignInScreen({ googleIcon }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, setGoogleAccount, isLoading } = useSession();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const isFormValid = isEmailValid && password.trim() !== '';
  const emailValidationState =
    trimmedEmail.length === 0 ? 'default' : isEmailValid ? 'success' : 'error';

  const handleSignIn = async () => {
    setSignInError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      if (errorMessage === 'WRONG_ROLE') {
        setSignInError(WRONG_ROLE_MESSAGE);
      } else {
        console.error('Sign-in failed:', errorMessage);
        setSignInError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSignInError(null);
    setIsSubmitting(true);
    let account: GoogleAccount | null = null;
    try {
      account = await getGoogleAccount();
      if (account) await signInWithGoogle(account);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage === 'GOOGLE_ACCOUNT_NOT_FOUND' && account) {
        setGoogleAccount(account);
        router.push('/auth/register/RegisterName');
      } else if (errorMessage === 'WRONG_ROLE') {
        setSignInError(WRONG_ROLE_MESSAGE);
      } else {
        console.error('Google sign-in failed:', error);
        setSignInError('Échec de la connexion avec Google. Merci de réessayer.');
      }
    } finally {
      setIsSubmitting(false);
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
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(value: string) => {
                setEmail(value);
                setSignInError(null);
              }}
            />
            <LabeledUnderlinedInput
              label="Mot de passe"
              placeholder="•••••••••••"
              type="password"
              value={password}
              onChangeText={(value: string) => {
                setPassword(value);
                setSignInError(null);
              }}
            />
            <Text className="text-secondary-400 text-right font-bold">Mot de passe oublié ?</Text>
            <Button
              label={isLoading || isSubmitting ? 'Connexion...' : 'Se connecter'}
              variant={isFormValid && !isLoading && !isSubmitting ? 'primary' : 'muted'}
              className="mx-2 mt-24"
              disabled={!isFormValid || isLoading || isSubmitting}
              onPress={handleSignIn}
            />
            {signInError && <Text className="text-red-500 text-center mt-4">{signInError}</Text>}
            <View className="flex-row items-center justify-between ">
              <Divider className="my-12 ml-12 bg-gray-400 w-1/4" />
              <Text className="text-gray-400 font-bold">OU</Text>
              <Divider className="my-12 mr-12 bg-gray-400 w-1/4" />
            </View>
            <Button
              icon={googleIcon}
              label="Connexion avec Google"
              variant="outline"
              className="mx-2"
              disabled={isSubmitting}
              onPress={handleGoogleSignIn}
            />
            <View className="flex-row items-center justify-center gap-2 mt-10">
              <Text className="text-gray-400">Vous n&apos;avez pas de compte ?</Text>
              <TouchableOpacity
                onPress={() => {
                  setGoogleAccount(null);
                  router.push('/auth/register/RegisterName');
                }}
              >
                <Text className="text-secondary-400 font-bold">S&apos;inscrire</Text>
              </TouchableOpacity>
            </View>
          </VStack>
        </FormControl>
      </Pressable>
    </View>
  );
}
