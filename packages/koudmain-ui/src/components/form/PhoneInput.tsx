import { Text, View } from 'react-native';
import { Input, InputField } from '../ui';
import { AsYouType, CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import {
  Select,
  SelectTrigger,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  SelectIcon,
  SelectScrollView,
} from '../ui/select';
import { ChevronDownIcon } from '../ui/icon';
import { COUNTRY_NAMES_FR } from './countries-fr';

type PhoneInputProps = React.ComponentProps<typeof InputField> & {
  label: string;
  containerClassName?: string;
  inputClassName?: string;
  validationState?: 'default' | 'error' | 'success';
  value: string;
  onChangeText: (text: string) => void;
  defaultCountry?: CountryCode;
};

export function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const COUNTRIES = getCountries()
  .map((code) => {
    let callingCode = '';
    try {
      callingCode = `+${getCountryCallingCode(code)}`;
    } catch (e) {
      // Skip country if it doesn't have a calling code
    }

    let name = COUNTRY_NAMES_FR[code] || code;

    return {
      code,
      name,
      flag: getFlagEmoji(code),
      callingCode,
    };
  })
  .filter((c) => c.callingCode)
  .sort((a, b) => a.name.localeCompare(b.name));

export function PhoneInput({
  label,
  containerClassName = '',
  inputClassName = '',
  validationState = 'default',
  className: fieldClassName = '',
  value,
  onChangeText,
  defaultCountry = 'FR',
  ...fieldProps
}: PhoneInputProps) {
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

  let activeCountry: CountryCode = defaultCountry;
  let localValue = value;

  if (value.startsWith('+')) {
    const matchedCountry = COUNTRIES.find((c) => value.startsWith(c.callingCode));
    if (matchedCountry) {
      activeCountry = matchedCountry.code;
      localValue = value.slice(matchedCountry.callingCode.length);
    }
  }

  const formatter = new AsYouType(activeCountry);
  const formattedLocalValue = formatter.input(localValue);

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/^\+/, '');
    const currentCountry = COUNTRIES.find((c) => c.code === activeCountry);
    const callingCode = currentCountry ? currentCountry.callingCode : '+33';
    onChangeText(callingCode + cleaned);
  };

  const handleCountryChange = (newCountryCode: string) => {
    const newCountry = COUNTRIES.find((c) => c.code === newCountryCode);
    if (newCountry) {
      onChangeText(newCountry.callingCode + localValue);
    }
  };

  return (
    <View className={containerClassName}>
      <Text className="text-primary dark:text-white font-inter font-bold text-xl mb-1">{label}</Text>
      <View className="flex-row items-end gap-3 h-12">
        <View className="w-[110px]">
          <Select
            selectedValue={activeCountry}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger
              variant="underlined"
              size="xl"
              className={[
                'rounded-none border-0 border-b-2 h-12 justify-between items-center pb-2 flex-row',
                borderClassByValidation[validationState],
                focusBorderClassByValidation[validationState],
              ].join(' ')}
            >
              <Text className="font-jakarta text-primary dark:text-white text-xl leading-tight pl-1">
                {(() => {
                  const c = COUNTRIES.find((c) => c.code === activeCountry);
                  return c ? `${c.flag} ${c.callingCode}` : '';
                })()}
              </Text>
              <SelectIcon className="mr-1" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectScrollView className="max-h-[300px] w-full">
                  {COUNTRIES.map((c) => (
                    <SelectItem
                      key={c.code}
                      label={`${c.flag} ${c.name} (${c.callingCode})`}
                      value={c.code}
                    />
                  ))}
                </SelectScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        <View className="flex-1">
          <Input
            variant="underlined"
            size="xl"
            className={[
              'rounded-none border-0 border-b-2 h-12',
              borderClassByValidation[validationState],
              focusBorderClassByValidation[validationState],
              inputClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <InputField
              {...fieldProps}
              value={formattedLocalValue}
              onChangeText={handleChangeText}
              keyboardType="phone-pad"
              allowFontScaling={false}
              className={[
                'px-0 font-jakarta text-primary dark:text-white h-12 leading-tight',
                fieldClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </Input>
        </View>
      </View>
    </View>
  );
}
