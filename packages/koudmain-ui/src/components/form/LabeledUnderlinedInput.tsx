import { Text, View } from 'react-native';
import { Input, InputField, InputIcon, InputSlot, EyeIcon, EyeOffIcon } from '../ui';
import { useState } from 'react';

type LabeledUnderlinedInputProps = React.ComponentProps<typeof InputField> & {
  label: string;
  containerClassName?: string;
  inputClassName?: string;
  validationState?: 'default' | 'error' | 'success';
};

/**
 * Un champ de saisie avec un label au-dessus et une ligne de soulignement. Il prend en charge les champs de mot de passe avec une icône pour basculer la visibilité, ainsi que les champs multiligne.
 * @param label - Le texte du label affiché au-dessus du champ de saisie.
 * @param multiline - Indique si le champ de saisie doit être multiligne. Par défaut, il est à false (champ à une seule ligne).
 * @param containerClassName - Classes supplémentaires pour le conteneur global du composant.
 * @param inputClassName - Classes supplémentaires pour le champ de saisie lui-même.
 * @param validationState - L'état de validation du champ, qui peut être 'default', 'error' ou 'success'. Cela affecte la couleur de la bordure du champ de saisie.
 * @param fieldProps - Toutes les autres propriétés standard d'un champ de saisie (InputField) de Gluestack.
 * @returns Un composant de champ de saisie stylisé avec un label et une ligne de soulignement, adapté pour les mots de passe et les champs multiligne.
 */
export default function LabeledUnderlinedInput({
  label,
  multiline = false,
  containerClassName = '',
  inputClassName = '',
  validationState = 'default',
  className: fieldClassName = '',
  ...fieldProps
}: LabeledUnderlinedInputProps) {
  const borderClassByValidation = {
    default: 'border-neutral-300',
    error: 'border-error',
    success: 'border-success',
  } as const;

  const focusBorderClassByValidation = {
    default: 'data-[focus=true]:border-secondary',
    error: 'data-[focus=true]:border-error',
    success: 'data-[focus=true]:border-success',
  } as const;

  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const isPasswordField = fieldProps.type === 'password';

  return (
    <View className={containerClassName}>
      <Text className="text-primary dark:text-white font-inter font-bold text-xl">{label}</Text>
      <Input
        variant="underlined"
        size="xl"
        className={[
          'rounded-none border-0 border-b-2',
          borderClassByValidation[validationState],
          focusBorderClassByValidation[validationState],
          multiline ? 'min-h-32 items-start' : 'h-12',
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <InputField
          {...fieldProps}
          multiline={multiline}
          type={isPasswordField ? (showPassword ? 'text' : 'password') : fieldProps.type}
          secureTextEntry={isPasswordField && !showPassword}
          textAlignVertical={multiline ? 'top' : 'center'}
          allowFontScaling={false}
          className={[
            'px-0 font-jakarta text-primary dark:text-white',
            multiline ? 'h-full py-3' : 'h-12',
            'leading-tight',
            fieldClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {isPasswordField && (
          <InputSlot className="pr-3" onPress={handleState}>
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        )}
      </Input>
    </View>
  );
}
