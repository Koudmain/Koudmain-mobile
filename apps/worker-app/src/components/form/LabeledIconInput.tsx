import { Text, TextInput, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { cnFusion } from '@/utils/cnFusion';

type LabeledIconInputProps = {
  iconName: React.ComponentProps<typeof FontAwesome5>['name'];
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  suffix?: string;
  iconSize?: number;
  iconColor?: string;
  keyboardType?: 'default' | 'number-pad' | 'numeric' | 'email-address' | 'phone-pad';
  placeholder?: string;
};

export default function LabeledIconInput({
  iconName,
  label,
  value,
  onChangeText,
  className,
  inputClassName,
  labelClassName,
  suffix,
  iconSize = 18,
  iconColor = '#6B7280',
  keyboardType = 'default',
  placeholder,
}: LabeledIconInputProps) {
  return (
    <View className={cnFusion('space-y-2', className)}>
      {label && (
        <Text
          className={cnFusion('text-sm font-semibold text-primary dark:text-white', labelClassName)}
        >
          {label}
        </Text>
      )}

      <View className="flex-row items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 dark:border-primary-600 dark:bg-primary-700">
        <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className={cnFusion(
            'mx-2 flex-1 text-right text-primary dark:text-white',
            inputClassName,
          )}
        />
        {suffix ? <Text className="font-bold text-gray-400">{suffix}</Text> : null}
      </View>
    </View>
  );
}
