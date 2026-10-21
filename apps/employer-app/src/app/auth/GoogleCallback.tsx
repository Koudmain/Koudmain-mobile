import { useEffect } from 'react';
import { router } from 'expo-router';

export default function GoogleCallback() {
  useEffect(() => {
    if (router.canGoBack()) router.back();
  }, []);
  return null;
}
