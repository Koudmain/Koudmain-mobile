import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { buildApiUrl } from '@koudmain/ui/utils/api';

export type GoogleAccount = {
  idToken: string;
  email: string;
  firstName: string;
  lastName: string;
};

// The backend runs the Google OAuth flow in the browser and redirects back to the app,
// so this works in Expo Go (no native Google module).
export async function getGoogleAccount(): Promise<GoogleAccount | null> {
  const redirectUrl = Linking.createURL('auth/GoogleCallback');
  const result = await WebBrowser.openAuthSessionAsync(
    buildApiUrl(`/auth/google?redirect=${encodeURIComponent(redirectUrl)}`),
    redirectUrl,
  );
  if (result.type !== 'success') return null;

  const { idToken, email, firstName, lastName, error } =
    Linking.parse(result.url).queryParams ?? {};
  if (error === 'cancelled') return null;
  if (typeof idToken !== 'string') throw new Error('GOOGLE_FAILED');

  return {
    idToken,
    email: String(email ?? ''),
    firstName: String(firstName ?? ''),
    lastName: String(lastName ?? ''),
  };
}
