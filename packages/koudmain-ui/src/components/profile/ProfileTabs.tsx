import { Pressable, Text, View } from 'react-native';
import { cnFusion } from '../../utils/cnFusion';

export interface ProfileTab<T extends string> {
  key: T;
  label: string;
}

interface ProfileTabsProps<T extends string> {
  tabs: ProfileTab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

export default function ProfileTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: ProfileTabsProps<T>) {
  return (
    <View className={cnFusion('flex-row', className)}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Pressable key={tab.key} onPress={() => onChange(tab.key)} className="flex-1">
            <Text
              className={cnFusion(
                'text-center text-base font-bold pb-2',
                isActive ? 'text-secondary' : 'text-primary dark:text-white',
              )}
            >
              {tab.label}
            </Text>
            <View
              className={cnFusion(
                'h-[3px] w-full',
                isActive ? 'bg-secondary' : 'bg-primary dark:bg-white',
              )}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
