import { useEffect } from 'react';
import { router } from 'expo-router';

// Android also delivers the Google OAuth redirect as a deep link; getGoogleAccount() already
// read it, so this route only exists to avoid an "Unmatched route" screen.
export default function GoogleCallback() {
  useEffect(() => {
    if (router.canGoBack()) router.back();
  }, []);
  return null;
}
