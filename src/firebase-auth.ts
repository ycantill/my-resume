import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
};

// Avoid re-initializing on hot reload
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export function createRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
}

export async function sendPhoneCode(
  phone: string,
  recaptcha: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phone, recaptcha);
}

export async function confirmPhoneCode(
  confirmation: ConfirmationResult,
  code: string
): Promise<void> {
  await confirmation.confirm(code);
  // Token is picked up by onAuthStateChanged in useAuth
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function isAuthConfigured(): boolean {
  return !!import.meta.env.VITE_FIREBASE_API_KEY && !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
}

/**
 * Current user's ID token, refreshed by the SDK when it is close to expiry.
 * Writes must always ask for it fresh: the token cached in the store is
 * minted at sign-in and Firebase rejects it about an hour later.
 */
export async function getFreshIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
