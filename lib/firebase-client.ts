/** Client-side Firebase authentication helpers — browser use only, not for server components. */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

/**
 * Returns the Firebase app singleton, initializing it if necessary.
 * Guarded so it only runs in the browser (not during SSR/prerender).
 */
const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
};

/**
 * Returns the Firebase Auth singleton for client-side use.
 * Must only be called in browser contexts (e.g. inside useEffect or event handlers).
 */
export const getFirebaseAuth = (): Auth => getAuth(getFirebaseApp());

/** Pre-configured Google OAuth 2.0 provider instance shared across sign-in calls. */
export const googleProvider = new GoogleAuthProvider();

/**
 * Opens the Google Sign-In popup and returns the authenticated Firebase user.
 * @returns A promise resolving to the signed-in Firebase {@link https://firebase.google.com/docs/reference/js/auth.user User}.
 * @throws {Error} When the user cancels the popup or an OAuth error occurs.
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
  return result.user;
};

/**
 * Signs the current user out of Firebase Auth.
 * @returns A promise that resolves once the sign-out is complete.
 * @throws {Error} When sign-out fails due to a Firebase Auth error.
 */
export const signOutUser = async () => {
  await signOut(getFirebaseAuth());
};
