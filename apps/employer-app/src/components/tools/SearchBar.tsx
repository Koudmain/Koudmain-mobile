import { View, useColorScheme } from 'react-native';
import { Input, InputField } from '@koudmain/ui/gluestack';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { colors } from '@/constants/theme';
import { cnFusion } from '@koudmain/ui/utils/cnFusion';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

export type SearchBarProps = {
  className?: string;
  value: string;
  placeholder?: string | 'Rechercher...';
  onChangeText: (text: string) => void;
  onFocus?: () => void;
};

const SearchBar = ({ className, value, placeholder, onChangeText, onFocus }: SearchBarProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className={cnFusion(
        'flex-row items-center bg-neutral-300 dark:bg-primary-hover py-1 px-4 rounded-full mx-4 my-2',
        className,
      )}
    >
      <EvilIcons
        name="search"
        size={24}
        color={isDark ? colors.primary.disabled : colors.primary.hover}
      />
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
        className="w-[90%] border-transparent"
      >
        <InputField
          placeholder={placeholder}
          className="text-primary"
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
        />
      </Input>
    </View>
  );
};

const SearchBarBottomSheet = ({
  className,
  value,
  placeholder,
  onChangeText,
  onFocus,
}: SearchBarProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className={cnFusion(
        'flex-row items-center bg-neutral-300 dark:bg-primary-hover py-1 px-4 rounded-full mx-4 my-2',
        className,
      )}
    >
      <EvilIcons
        name="search"
        size={24}
        color={isDark ? colors.primary.disabled : colors.primary.hover}
      />
      <BottomSheetTextInput
        placeholder={placeholder}
        className="text-primary w-[90%] py-3 px-2"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
      />
    </View>
  );
};

export { SearchBarBottomSheet };
export default SearchBar;
