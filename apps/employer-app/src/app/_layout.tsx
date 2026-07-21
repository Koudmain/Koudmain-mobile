import '@/global.css';
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@koudmain/ui/gluestack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SidebarProvider } from '@/context/SidebarContext';
import { Sidebar } from '@/components/navigation/sidebar/Sidebar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme, ThemeProvider } from '@koudmain/ui/context/ThemeContext';
import { SessionProvider, useSession } from '@koudmain/ui/context/SessionContext';
import { CompanyProvider } from '@/context/CompanyContext';
import { SplashScreenController } from '@/Splash';
import { useEffect } from 'react';
import { socketService } from '@/services/socket.service';

function RootNavigator() {
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      socketService.connect(session);
    } else {
      socketService.disconnect();
    }
    return () => {
      socketService.disconnect();
    };
  }, [session]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(menu)" />
        <Stack.Screen name="offer/[id]" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="auth/Connection" />
        <Stack.Screen name="auth/SignIn" />
        <Stack.Screen name="auth/register/RegisterEmail" />
        <Stack.Screen name="auth/register/RegisterPassword" />
        <Stack.Screen name="auth/register/RegisterName" />
      </Stack.Protected>
    </Stack>
  );
}

function RootLayoutContent() {
  const { colorMode, themePreference } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GluestackUIProvider mode={themePreference}>
          <SessionProvider targetApp="employer">
            <CompanyProvider>
              <SidebarProvider>
                <SafeAreaView className="flex-1 bg-white dark:bg-primary" edges={['top']}>
                  <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
                  <SplashScreenController />
                  <RootNavigator />
                </SafeAreaView>
                <Sidebar />
              </SidebarProvider>
            </CompanyProvider>
          </SessionProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
