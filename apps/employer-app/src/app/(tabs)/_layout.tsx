import { Tabs } from 'expo-router';
import { FontAwesome6, Feather } from '@expo/vector-icons';
import { TabBarIcon, ICON_DIMENSIONS, TabBarHitBox, TabBarGradient } from '@koudmain/ui';
import { useColorScheme } from 'react-native';
import { colors } from '@/constants/theme';
import { useSidebar } from '@/context/SidebarContext';
import { PlusIcon } from '@/svg/PlusIcon';

const TABS_CONFIG = [
  { name: 'index', IconLibrary: FontAwesome6, iconName: 'newspaper', label: 'Accueil' },
  { name: 'Planning', IconLibrary: Feather, iconName: 'calendar', label: 'Planning' },
  { name: 'CreatePost', SvgComponent: PlusIcon, label: 'Publier', isLarge: true },
  { name: 'Messaging', IconLibrary: FontAwesome6, iconName: 'message', label: 'Messages' },
  { name: 'Profile', IconLibrary: Feather, iconName: 'menu', label: 'Menu' },
];

export default function TabLayout() {
  const { toggle } = useSidebar();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors?.secondary.DEFAULT,
        tabBarInactiveTintColor: isDark ? colors?.primary.content : colors?.primary.DEFAULT,
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
                  iconName={tab.iconName}
                  SvgComponent={tab.SvgComponent}
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
