import { View, Text } from 'react-native';
import { Switch } from '@koudmain/ui/gluestack';
import { colors } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
export type HorizontalSwitchProps = {
  isEnabled: boolean;
  toggleSwitch: () => void;
  iconExpo?: React.ReactNode;
  text?: string;
};

export default function HorizontalSwitch({
  isEnabled,
  toggleSwitch,
  iconExpo,
  text,
}: HorizontalSwitchProps) {
  const { track } = useThemeColors();
  return (
    <View className="flex-row items-center gap-2 w-full">
      <Switch
        size="md"
        isDisabled={false}
        trackColor={{ false: track, true: colors.secondary.DEFAULT }}
        thumbColor={colors.surface.card}
        ios_backgroundColor={track}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      {iconExpo}
      {text && (
        <Text
          className="text-primary dark:text-white font-inter text-md flex-1"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      )}
    </View>
  );
}
