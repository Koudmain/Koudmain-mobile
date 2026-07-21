import React, { useEffect, useState } from 'react';
import { View, Pressable, Dimensions, ScrollView, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSidebar } from '@/context/SidebarContext';
import { Text } from '@koudmain/ui/gluestack';
import { UserHeader } from './UserHeader';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Href, useRouter } from 'expo-router';
import { ThemeToggle } from '@koudmain/ui/components/tools/ThemeToggle';

import { useSession } from '@koudmain/ui/context/SessionContext';
import { scheduleOnRN } from 'react-native-worklets';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.65;

export function Sidebar() {
  const { isOpen, close } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const translateX = useSharedValue(SIDEBAR_WIDTH);
  const opacity = useSharedValue(0);

  const router = useRouter();

  const { signOut } = useSession();

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.exp) });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 250 });
      translateX.value = withTiming(SIDEBAR_WIDTH, { duration: 250 }, () => {
        scheduleOnRN(setIsMounted, false);
      });
    }
  }, [isOpen, opacity, translateX]);

  const animatedMenuSyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const menuItems = [
    { label: 'Mon porte-monnaie', path: '/YourOffers' },
    { label: 'Mes candidatures', path: '/applications' },
    { label: 'Paramètre du Compte', path: '/Settings' },
    { label: 'Mes documents', path: '/contracts' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Mes favoris', path: '/YourOffers' },
  ];

  const handleItemPress = (path: string | null) => {
    close();
    if (path) {
      router.push(path as Href);
    }
  };

  if (!isMounted) return null;

  return (
    <View className="absolute inset-0 z-[999] flex-row" pointerEvents="box-none">
      {/* Fond sombre */}
      <Animated.View
        style={animatedOverlayStyle}
        className="absolute inset-0 bg-black/80 dark:bg-white/80"
      >
        <Pressable className="flex-1" onPress={close} />
      </Animated.View>

      {/* Fond avec contenu */}
      <Animated.View
        style={[{ width: SIDEBAR_WIDTH }, animatedMenuSyle]}
        className="h-full rounded-l-[20] bg-white dark:bg-primary ml-auto p-1 pt-16 shadow-2xl"
      >
        <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12 }}>
          <UserHeader />

          <View className="flex-1 py-2">
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleItemPress(item.path)}
                className="py-4 dark:active:bg-primary-hover active:bg-gray-50 rounded-lg"
              >
                <Text className="text-primary dark:text-white font-medium text-[15px]">
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-auto pt-6 border-t border-primary-disabled">
            <ThemeToggle />
            <Pressable onPress={close} className="py-4 flex-row items-center active:opacity-70">
              <Feather
                name="help-circle"
                size={20}
                color={isDark ? colors.primary.disabled : colors.primary.hover}
              />
              <Text className="text-primary-hover dark:text-primary-disabled font-medium ml-3">
                Centre d&apos;aide
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                signOut();
                close();
              }}
              className="py-4 mb-2 flex-row items-center active:opacity-70"
            >
              <Feather name="log-out" size={20} color={colors.error.DEFAULT} />
              <Text className="text-error font-bold ml-3">Déconnexion</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
