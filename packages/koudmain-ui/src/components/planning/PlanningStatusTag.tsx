import { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '../ui';
import { colors } from '../../constants/theme';

export type PlanningStatusTone = 'success' | 'secondary' | 'muted';

const TONE_STYLES: Record<PlanningStatusTone, { container: string; text: string; icon: string }> = {
  success: {
    container: 'bg-success/20 border-success',
    text: 'text-success',
    icon: colors.success.DEFAULT,
  },
  secondary: {
    container: 'bg-secondary/20 border-secondary',
    text: 'text-secondary',
    icon: colors.secondary.DEFAULT,
  },
  muted: {
    container: 'bg-primary-400/20 border-primary-400/60',
    text: 'text-primary-400/60',
    icon: colors.primary[400],
  },
};

export interface PlanningStatusTagProps {
  label: string;
  tone: PlanningStatusTone;
  renderIcon?: (color: string) => ReactNode;
}

export default function PlanningStatusTag({ label, tone, renderIcon }: PlanningStatusTagProps) {
  const styles = TONE_STYLES[tone];

  if (renderIcon) {
    return (
      <View
        accessible
        accessibilityLabel={label}
        className={`w-12 h-6 items-center justify-center border rounded-full ${styles.container}`}
      >
        {renderIcon(styles.icon)}
      </View>
    );
  }

  return (
    <View className={`border rounded-full px-2.5 py-0.5 ${styles.container}`}>
      <Text className={`text-2xs font-bold ${styles.text}`}>{label}</Text>
    </View>
  );
}
