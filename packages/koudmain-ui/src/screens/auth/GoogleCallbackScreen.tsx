import { useEffect } from 'react';
import { router } from 'expo-router';

export function GoogleCallbackScreen() {
  useEffect(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, []);
  return null;
}
