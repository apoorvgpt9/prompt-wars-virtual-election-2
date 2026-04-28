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

export const googleProvider = new GoogleAuthProvider();

/**
 * Opens Google Sign-In popup. Returns Firebase User on success.
 * Throws on cancellation or error.
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
  return result.user;
};

/**
 * Signs out the current user.
 */
export const signOutUser = async () => {
  await signOut(getFirebaseAuth());
};
