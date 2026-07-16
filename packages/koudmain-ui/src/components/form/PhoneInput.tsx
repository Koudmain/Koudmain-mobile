import { useState } from 'react';
import { Text, View } from 'react-native';
import { Input, InputField } from '../ui';
import {
  AsYouType,
  CountryCode,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  getExampleNumber,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
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
import { COUNTRY_NAMES_FR } from './countriesFr';

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
    } catch {
      // Skip country if it doesn't have a calling code
    }

    const name = COUNTRY_NAMES_FR[code] || code;

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

  const [internalCountry, setInternalCountry] = useState<CountryCode>(defaultCountry);

  let activeCountry: CountryCode = internalCountry;
  let formattedLocalValue = '';

  const parsed = parsePhoneNumberFromString(value);
  if (parsed && parsed.country) {
    activeCountry = parsed.country;
    if (internalCountry !== parsed.country) {
      setInternalCountry(parsed.country);
    }
    formattedLocalValue = parsed.formatNational();
  } else {
    let localValue = value;
    if (value.startsWith('+')) {
      const currentCountryObj = COUNTRIES.find((c) => c.code === internalCountry);
      // This prevents NA country code (+1) from instantly reverting to the first +1 country (US/Antigua) in the list.
      if (currentCountryObj && value.startsWith(currentCountryObj.callingCode)) {
        activeCountry = internalCountry;
        localValue = value.slice(currentCountryObj.callingCode.length);
      } else {
        const matchedCountry = COUNTRIES.find((c) => value.startsWith(c.callingCode));
        if (matchedCountry) {
          activeCountry = matchedCountry.code;
          if (internalCountry !== matchedCountry.code) {
            setInternalCountry(matchedCountry.code);
          }
          localValue = value.slice(matchedCountry.callingCode.length);
        }
      }
    }
    const formatter = new AsYouType(activeCountry);
    formattedLocalValue = formatter.input(localValue);
  }

  const exampleNumber = getExampleNumber(activeCountry, examples);
  const dynamicPlaceholder = exampleNumber
    ? exampleNumber.formatNational()
    : fieldProps.placeholder || '';

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, '');
    const currentCountry = COUNTRIES.find((c) => c.code === activeCountry);
    const callingCode = currentCountry ? currentCountry.callingCode : '+33';

    const asYouType = new AsYouType(activeCountry);
    asYouType.input(text);
    const phone = asYouType.getNumber();

    if (phone && phone.isValid()) {
      onChangeText(phone.format('E.164'));
    } else {
      onChangeText(callingCode + cleaned);
    }
  };

  const handleCountryChange = (newCountryCode: string) => {
    const newCountry = COUNTRIES.find((c) => c.code === newCountryCode);
    if (newCountry) {
      setInternalCountry(newCountryCode as CountryCode);
      const parsed = parsePhoneNumberFromString(value);
      if (parsed) {
        onChangeText(parsed.format('E.164').replace(/^\+\d+/, newCountry.callingCode));
      } else {
        onChangeText(newCountry.callingCode);
      }
    }
  };

  return (
    <View className={containerClassName}>
      <Text className="text-primary dark:text-white font-inter font-bold text-xl mb-1">
        {label}
      </Text>
      <View className="flex-row items-end gap-3 h-12">
        <View className="w-[110px]">
          <Select selectedValue={activeCountry} onValueChange={handleCountryChange}>
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
              placeholder={dynamicPlaceholder}
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
