import { Tabs } from 'expo-router';
import { FontAwesome6, Feather } from '@expo/vector-icons';
import { TabBarIcon, ICON_DIMENSIONS } from '@koudmain/ui/components/navigation/TabBarIcon';
import { TabBarGradient } from '@koudmain/ui/components/navigation/TabBarGradient';
import { useColorScheme } from 'react-native';
import { colors } from '@/constants/theme';
import { TabBarHitBox } from '@koudmain/ui/components/navigation/TabBarHitBox';
import { useSidebar } from '@/context/SidebarContext';
import { MapIcon } from '@/svg/MapIcon';

const TABS_CONFIG = [
  {
    name: 'Offers',
    IconLibrary: FontAwesome6,
    iconName: 'newspaper',
    label: 'offers',
    isLarge: false,
  },
  {
    name: 'Planning',
    IconLibrary: Feather,
    iconName: 'calendar',
    label: 'planning',
    isLarge: false,
  },
  {
    name: 'Map',
    SvgComponent: MapIcon,
    label: 'Publier',
    isLarge: true,
  },
  {
    name: 'Messaging',
    IconLibrary: FontAwesome6,
    iconName: 'message',
    label: 'messaging',
    isLarge: false,
  },
  {
    name: 'Profile',
    IconLibrary: Feather,
    iconName: 'menu',
    label: 'Menu',
    isLarge: false,
  },
];

export default function TabLayout() {
  const { toggle } = useSidebar();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.secondary.DEFAULT,
        tabBarInactiveTintColor: isDark ? colors.primary.content : colors.primary.DEFAULT,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarBackground: () => <TabBarGradient />,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          height: 80,
          flexDirection: 'row',
          justifyContent: 'center',
        },
      }}
    >
      {TABS_CONFIG.map((tab) => {
        const dimensions = tab.isLarge ? ICON_DIMENSIONS.large : ICON_DIMENSIONS.small;
        const size = dimensions.container;

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            listeners={{
              tabPress: (e) => {
                if (tab.name === 'Profile') {
                  e.preventDefault();
                  toggle();
                }
              },
            }}
            options={{
              tabBarButton: (props) => <TabBarHitBox props={props} size={size} />,
              tabBarIcon: ({ color }) => (
                <TabBarIcon
                  IconLibrary={tab.IconLibrary}
                  SvgComponent={tab.SvgComponent}
                  iconName={tab.iconName}
                  color={color}
                  isLarge={tab.isLarge}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
