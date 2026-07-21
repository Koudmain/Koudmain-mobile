import { Text, View } from 'react-native';

export type PasswordCriteria = {
  length: boolean;
  special: boolean;
  uppercase: boolean;
  number: boolean;
};

type PasswordCheckerProps = {
  password: string;
  className?: string;
};

const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
const UPPERCASE_REGEX = /[A-Z]/;
const NUMBER_REGEX = /[0-9]/;

export function getPasswordCriteria(password: string): PasswordCriteria {
  return {
    length: password.length >= 8,
    special: SPECIAL_CHAR_REGEX.test(password),
    uppercase: UPPERCASE_REGEX.test(password),
    number: NUMBER_REGEX.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const criteria = getPasswordCriteria(password);
  return Object.values(criteria).every(Boolean);
}

function Criterion({ isValid, label }: { isValid: boolean; label: string }) {
  return (
    <Text className={`${isValid ? 'text-success' : 'text-error'} text-sm`}>
      {isValid ? '✓' : '✕'} {label}
    </Text>
  );
}

export function PasswordChecker({ password, className = '' }: PasswordCheckerProps) {
  const criteria = getPasswordCriteria(password);

  return (
    <View className={className}>
      <View className="gap-1">
        <Criterion isValid={criteria.length} label="8 caractères minimum" />
        <Criterion isValid={criteria.special} label="Au moins un caractère spécial" />
        <Criterion isValid={criteria.uppercase} label="Au moins une majuscule" />
        <Criterion isValid={criteria.number} label="Au moins un chiffre" />
      </View>
    </View>
  );
}
