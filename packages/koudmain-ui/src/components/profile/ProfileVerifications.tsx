import React from 'react';
import { Text, View, useColorScheme } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../constants/theme';
import { cnFusion } from '../../utils/cnFusion';

export interface ProfileVerification {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  verified: boolean;
}

interface ProfileVerificationsProps {
  items: ProfileVerification[];
}

export default function ProfileVerifications({ items }: ProfileVerificationsProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View
      className="flex-row py-6 px-2 rounded-[16] bg-white dark:bg-primary-700 shadow-md"
      style={{ elevation: 4 }}
    >
      {items.map((item) => (
        <View key={item.label} className="flex-1 items-center px-1">
          <View
            className={cnFusion(
              'w-12 h-12 rounded-full items-center justify-center border',
              item.verified
                ? 'bg-secondary-50 border-secondary dark:bg-transparent'
                : 'bg-primary-50 border-primary-300 dark:bg-transparent dark:border-primary-400',
            )}
          >
            <MaterialIcons
              name={item.icon}
              size={24}
              color={
                item.verified
                  ? colors.secondary.DEFAULT
                  : isDark
                    ? colors.primary[400]
                    : colors.primary[300]
              }
            />
          </View>
          <Text
            className={cnFusion(
              'mt-2 text-xs font-medium text-center',
              item.verified
                ? 'text-primary dark:text-white'
                : 'text-primary-400 dark:text-primary-400',
            )}
          >
            {item.label}
          </Text>
          {!item.verified && (
            <Text className="text-[10px] text-primary-400 text-center">Non vérifié</Text>
          )}
        </View>
      ))}
    </View>
  );
}
