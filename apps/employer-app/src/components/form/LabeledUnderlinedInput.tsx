import { Text, View } from 'react-native';

import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { useState } from 'react';

type LabeledUnderlinedInputProps = React.ComponentProps<typeof InputField> & {
  label: string;
  containerClassName?: string;
  inputClassName?: string;
  validationState?: 'default' | 'error' | 'success';
};

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
