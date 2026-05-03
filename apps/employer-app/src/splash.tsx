import { SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSession } from '@/context/SessionContext';

void SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();
  const [hasHiddenNativeSplash, setHasHiddenNativeSplash] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasHiddenNativeSplash) {
      void SplashScreen.hideAsync().finally(() => {
        setHasHiddenNativeSplash(true);
      });
    }
  }, [isLoading, hasHiddenNativeSplash]);

  if (hasHiddenNativeSplash && isLoading) {
    return (
      <View className="absolute inset-0 z-50 bg-white items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
