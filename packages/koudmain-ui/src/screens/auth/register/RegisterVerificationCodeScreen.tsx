import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FormControl, Button } from '@koudmain/ui/components/ui/index';
import { AuthTop } from '@koudmain/ui/components/auth/AuthTop';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { authService } from '@koudmain/ui/api/auth.api';

export function RegisterVerificationCodeScreen() {
  const { userId: userIdParam, email: emailParam } = useLocalSearchParams<{
    userId?: string | string[];
    email?: string | string[];
  }>();

  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const { verifyEmail } = useSession();
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const isCodeComplete = code.every((digit) => digit.length === 1);

  const handleCodeChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length === 6 && index === 0) {
      setCode(numericText.split(''));
      Keyboard.dismiss();
      return;
    }

    const newCode = [...code];
    newCode[index] = numericText.substring(0, 1);
    setCode(newCode);

    if (numericText.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleVerify = async () => {
    if (!isCodeComplete || !userId) return;

    setIsVerifying(true);
    try {
      const success = await verifyEmail(parseInt(userId, 10), code.join(''));
      if (success) {
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Code invalide. Veuillez réessayer.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!userId) return;
    try {
      const res = await authService.resendVerification(parseInt(userId, 10));
      Alert.alert('Code envoyé', res.message || 'Code renvoyé !');
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Erreur lors du renvoi du code.');
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-primary">
      <AuthTop title="Inscription" />
      <Pressable onPress={Keyboard.dismiss} className="flex-1">
        <FormControl className="flex-1">
          <View className="flex-1 px-10 pb-10">
            <View className="gap-4 mt-12">
              <Text className="text-primary dark:text-white text-4xl font-bold mb-2">
                Code à 6 chiffres
              </Text>
              <Text className="text-gray-400 dark:text-gray-300 mb-8 px-1">
                Code envoyé à l'adresse{' '}
                <Text className="font-bold text-secondary">{email || 'votre email'}</Text>
              </Text>

              <View className="flex-row items-center justify-center gap-2 mt-20">
                {code.map((digit, index) => (
                  <React.Fragment key={index}>
                    <View
                      className={`w-12 h-14 rounded-lg border flex justify-center items-center ${
                        digit ? 'border-secondary-500' : 'border-grey-500 dark:border-white'
                      }`}
                    >
                      <TextInput
                        ref={(ref) => {
                          inputRefs.current[index] = ref;
                        }}
                        className="text-2xl font-semibold text-primary dark:text-white text-center w-full h-full"
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleCodeChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        selectTextOnFocus
                      />
                    </View>
                    {index === 2 && (
                      <Text className="text-primary dark:text-white text-2xl mx-1">-</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>

              <Pressable onPress={handleResend} className="mt-6">
                <Text className="text-secondary-500 font-bold text-center text-sm">
                  Renvoyer le code
                </Text>
              </Pressable>
            </View>

            <View className="mt-auto">
              <Button
                label={isVerifying ? 'Vérification...' : 'Continuer'}
                variant={isCodeComplete && !isVerifying ? 'primary' : 'muted'}
                disabled={!isCodeComplete || isVerifying}
                onPress={handleVerify}
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
          </View>
        </FormControl>
      </Pressable>
    </View>
  );
}
