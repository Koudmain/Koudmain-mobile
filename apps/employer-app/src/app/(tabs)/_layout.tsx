import { Tabs } from 'expo-router';
import { FontAwesome6, Feather } from '@expo/vector-icons';
import { TabBarIcon, ICON_DIMENSIONS } from '@koudmain/ui/components/navigation/TabBarIcon';
import { TabBarGradient } from '@koudmain/ui/components/navigation/TabBarGradient';
import { useColorScheme } from 'react-native';
import { colors } from '@/constants/theme';
import { TabBarHitBox } from '@koudmain/ui/components/navigation/TabBarHitBox';
import { useSidebar } from '@/context/SidebarContext';
import { PlusIcon } from '@/svg/PlusIcon';

const TABS_CONFIG = [
  { name: 'index', iconLibrary: FontAwesome6, iconName: 'newspaper', label: 'Accueil' },
  { name: 'Planning', iconLibrary: Feather, iconName: 'calendar', label: 'Planning' },
  { name: 'CreatePost', svgComponent: PlusIcon, label: 'Publier', isLarge: true },
  { name: 'Messaging', iconLibrary: FontAwesome6, iconName: 'message', label: 'Messages' },
  { name: 'Profile', iconLibrary: Feather, iconName: 'menu', label: 'Menu' },
];

export default function TabLayout() {
  const { toggle } = useSidebar();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.secondary.DEFAULT,
        tabBarInactiveTintColor: isDark ? colors.primary.content : colors.primary.DEFAULT,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarBackground: () => <TabBarGradient />,
        tabBarStyle: {
          display: route.name === 'CreatePost' ? 'none' : 'flex',
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          height: 80,
          flexDirection: 'row',
          justifyContent: 'center',
        },
      })}
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
                  iconLibrary={tab.iconLibrary}
                  iconName={tab.iconName}
                  svgComponent={tab.svgComponent}
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
