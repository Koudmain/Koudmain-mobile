import { View, Text } from 'react-native';
import { Switch } from '@/components/ui/switch';
import { colors } from '@/constants/theme';
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
  return (
    <View className="flex-row items-center gap-2 w-full">
      <Switch
        size="md"
        isDisabled={false}
        trackColor={{ false: colors.primary.DEFAULT, true: colors.secondary.DEFAULT }}
        thumbColor={colors.surface.card}
        ios_backgroundColor={colors.primary.DEFAULT}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      {iconExpo}
      {text && (
        <Text
          className="text-primary font-inter text-md flex-1"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      )}
    </View>
  );
}
