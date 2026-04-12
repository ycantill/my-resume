import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-auth';
import { useAppStore } from '../store/useAppStore';

/**
 * Initializes the Firebase auth state listener and syncs the idToken
 * to the Zustand store. Call once at the top-level component.
 */
export function useAuth() {
  const setAuthToken = useAppStore(state => state.setAuthToken);
  const setContactData = useAppStore(state => state.setContactData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setAuthToken(token);
      } else {
        setAuthToken(null);
        setContactData(null);
      }
    });

    return unsubscribe;
  }, [setAuthToken, setContactData]);
}
