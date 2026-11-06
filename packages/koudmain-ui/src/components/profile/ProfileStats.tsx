import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { cnFusion } from '../../utils/cnFusion';

export interface ProfileStat {
  value: string;
  label: string;
}

interface ProfileStatsProps {
  stats: ProfileStat[];
  className?: string;
}

export default function ProfileStats({ stats, className }: ProfileStatsProps) {
  return (
    <View
      className={cnFusion(
        'flex-row py-4 border-y border-primary-200 dark:border-primary-400',
        className,
      )}
    >
      {stats.map((stat, index) => (
        <Fragment key={stat.label}>
          {index > 0 && <View className="w-px bg-primary-200 dark:bg-primary-400" />}
          <View className="flex-1 items-center px-1">
            <Text className="text-lg font-bold text-primary dark:text-white">{stat.value}</Text>
            <Text className="text-xs font-semibold text-center text-primary dark:text-white">
              {stat.label}
            </Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}
