import {
  View,
  Text,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import LabeledUnderlinedInput from '@koudmain/ui/components/form/LabeledUnderlinedInput';
import { PhoneInput, COUNTRIES } from '@koudmain/ui/components/form/PhoneInput';
import { VStack, FormControl, Button } from '@koudmain/ui/components/ui/index';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '../../../components/ui/select';
import { ChevronDownIcon } from '../../../components/ui/icon';
import { AuthTop } from '../../../components/auth/AuthTop';
type RegisterNameScreenProps = {
  appContext: 'employer' | 'worker';
};

export function RegisterNameScreen({ appContext }: RegisterNameScreenProps) {
  const { email: emailParam, password: passwordParam } = useLocalSearchParams<{
    email?: string | string[];
    password?: string | string[];
  }>();
  const email = Array.isArray(emailParam) ? (emailParam[0] ?? '') : (emailParam ?? '');
  const password = Array.isArray(passwordParam) ? (passwordParam[0] ?? '') : (passwordParam ?? '');
  const [birthDate, setBirthDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ownerPosition, setOwnerPosition] = useState('');

  const isFirstNameValid = firstName.trim().length > 0;
  const isLastNameValid = lastName.trim().length > 0;
  const isPhoneNumberValid = isValidPhoneNumber(phoneNumber);
  const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;
  const isBirthDateValid = appContext === 'worker' ? DATE_REGEX.test(birthDate) : true;
  const isFormValid = isFirstNameValid && isLastNameValid && isPhoneNumberValid && isBirthDateValid;

  const isPhoneEmpty = !phoneNumber || COUNTRIES.some((c) => phoneNumber === c.callingCode);

  const firstNameValidationState =
    firstName.length === 0 ? 'default' : isFirstNameValid ? 'success' : 'error';
  const lastNameValidationState =
    lastName.length === 0 ? 'default' : isLastNameValid ? 'success' : 'error';
  const phoneNumberValidationState = isPhoneEmpty
    ? 'default'
    : isPhoneNumberValid
      ? 'success'
      : 'error';
  const birthDateValidationState =
    birthDate.length === 0 ? 'default' : isBirthDateValid ? 'success' : 'error';

  const handleBirthDateChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    setBirthDate(formatted);
  };

  const convertBirthDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return undefined;
  };

  const handleContinue = async () => {
    if (appContext === 'worker') {
      router.push({
        pathname: '/auth/register/RegisterJob',
        params: { firstName, lastName, phoneNumber, birthDate: convertBirthDate(birthDate) },
      });
    } else {
      router.push({
        pathname: '/auth/register/RegisterEstablishment',
        params: { firstName, lastName, phoneNumber, ownerPosition },
      });
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-primary h-full">
      <AuthTop title="Inscription" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={Keyboard.dismiss} className="flex-1">
            <FormControl className="flex-1">
              <VStack className="flex flex-col justify-around flex-1 px-10 py-6">
                <View className="gap-4">
                  <Text className="text-primary dark:text-white text-4xl font-bold px-2">
                    Créer un compte
                  </Text>
                  <Text className="text-gray-500 dark:text-white mb-6">
                    Renseignez votre nom et prénom pour commencer la création de votre compte.
                  </Text>
                  <LabeledUnderlinedInput
                    label="Prénom"
                    placeholder="John"
                    type="text"
                    value={firstName}
                    validationState={firstNameValidationState}
                    onChangeText={(value: string) => {
                      setFirstName(value);
                    }}
                  />
                  <LabeledUnderlinedInput
                    label="Nom"
                    placeholder="Doe"
                    type="text"
                    value={lastName}
                    validationState={lastNameValidationState}
                    onChangeText={(value: string) => {
                      setLastName(value);
                    }}
                  />
                  <PhoneInput
                    label="Numéro de téléphone"
                    value={phoneNumber}
                    validationState={phoneNumberValidationState}
                    onChangeText={(value: string) => {
                      setPhoneNumber(value);
                    }}
                  />
                  {appContext === 'worker' && (
                    <LabeledUnderlinedInput
                      label="Date de naissance"
                      placeholder="JJ/MM/AAAA"
                      type="text"
                      keyboardType="numeric"
                      value={birthDate}
                      validationState={birthDateValidationState}
                      onChangeText={handleBirthDateChange}
                    />
                  )}
                  {appContext === 'employer' && (
                    <View className="mt-2">
                      <Text className="text-primary dark:text-white font-inter font-bold text-xl mb-5">
                        Votre fonction
                      </Text>
                      <Select
                        selectedValue={ownerPosition}
                        onValueChange={(value) => setOwnerPosition(value)}
                      >
                        <SelectTrigger
                          variant="outline"
                          size="xl"
                          className="justify-between w-full"
                        >
                          <SelectInput
                            placeholder="Sélectionnez votre fonction"
                            className="flex-1"
                          />
                          <SelectIcon className="mr-3" as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <SelectItem label="Propriétaire" value="OWNER" />
                            <SelectItem label="Directeur" value="DIRECTOR" />
                            <SelectItem label="Manager" value="MANAGER" />
                            <SelectItem label="RH" value="HR" />
                            <SelectItem label="Autre" value="OTHER" />
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </View>
                  )}
                </View>
                <View className="mt-10">
                  <Button
                    label="Continuer"
                    variant={isFormValid ? 'primary' : 'muted'}
                    className="mx-2"
                    disabled={!isFormValid}
                    onPress={handleContinue}
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
              </VStack>
            </FormControl>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
