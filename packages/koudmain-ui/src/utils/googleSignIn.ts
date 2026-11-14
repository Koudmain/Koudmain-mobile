import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { authService } from '@koudmain/ui/api/auth.api';

export type GoogleAccount = {
  idToken: string;
  verifier: string;
  email: string;
  firstName: string;
  lastName: string;
};

export async function getGoogleAccount(): Promise<GoogleAccount | null> {
  const redirectUrl = Linking.createURL('auth/GoogleCallback');
  const { url, verifier } = await authService.googleStart(redirectUrl);

  let lateRedirect = null as string | null;
  const subscription = Linking.addEventListener('url', (event) => {
    if (event.url.startsWith(redirectUrl)) lateRedirect = event.url;
  });
  let result: WebBrowser.WebBrowserAuthSessionResult;
  try {
    result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
    if (result.type === 'dismiss' && !lateRedirect) await new Promise((r) => setTimeout(r, 1000));
  } finally {
    subscription.remove();
  }
  const returnUrl = result.type === 'success' ? result.url : lateRedirect;
  if (!returnUrl) return null;

  const { idToken, email, firstName, lastName, error } = Linking.parse(returnUrl).queryParams ?? {};
  if (error === 'cancelled') return null;
  if (typeof idToken !== 'string') throw new Error('GOOGLE_FAILED');

  return {
    idToken,
    verifier,
    email: String(email ?? ''),
    firstName: String(firstName ?? ''),
    lastName: String(lastName ?? ''),
  };
}
