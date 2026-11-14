import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Heading, Text } from '../ui';
import { colors } from '../../constants/theme';

export interface PlanningCardBaseProps {
  title: string;
  wage: number;
  start: string;
  end: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  header?: ReactNode;
  headerRight?: ReactNode;
  children?: ReactNode;
}

function InfoRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="flex-row items-center mt-3">
      <View className="w-8 items-center">{icon}</View>
      <Text className="text-lg font-medium ml-2 text-primary dark:text-primary-200">{label}</Text>
    </View>
  );
}

export default function PlanningCardBase({
  title,
  wage,
  start,
  end,
  onPress,
  accessibilityLabel,
  header,
  headerRight,
  children,
}: PlanningCardBaseProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? title}
      className="active:opacity-80"
    >
      <Card className="w-full p-4 rounded-[20] border border-primary/[0.12] dark:border-white/[0.14] bg-background-light dark:bg-primary">
        {header ? <View className="mb-3">{header}</View> : null}
        <View className="flex-row items-center justify-between">
          <Heading
            className="text-2xl font-bold flex-1 mr-2 text-primary dark:text-primary-200"
            numberOfLines={1}
          >
            {title}
          </Heading>
          {headerRight}
        </View>

        <InfoRow
          icon={
            <FontAwesome6 name="money-bill-1-wave" size={26} color={colors.secondary.DEFAULT} />
          }
          label={`${wage}€/h`}
        />
        <InfoRow
          icon={<MaterialCommunityIcons name="clock" size={30} color={colors.secondary.DEFAULT} />}
          label={`${start}-${end}`}
        />

        {children}
      </Card>
    </Pressable>
  );
}
