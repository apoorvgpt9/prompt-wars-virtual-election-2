/** Client-side Firestore helpers for persisting and retrieving user learning sessions. */
import { getFirestore, doc, setDoc, getDoc, type Firestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

/**
 * Returns the Firestore singleton, initializing the Firebase app if needed.
 * Lazy-initialized so it does not execute during SSR/prerender.
 */
const getDb = (): Firestore => {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
};

/**
 * Saves the user's learning session to Firestore.
 * Collection path: sessions/{userId}/records/{timestamp}
 * @param userId - Firebase UID of the authenticated user.
 * @param topic - The election topic the user studied.
 * @param score - Whether the quiz answer was correct.
 * @param feedback - The evaluator feedback string returned by the AI.
 * @returns A promise that resolves when the document has been written.
 * @throws {Error} When the Firestore write fails due to network or permission errors.
 */
export const saveSession = async (
  userId: string,
  topic: string,
  score: boolean,
  feedback: string
): Promise<void> => {
  const ref = doc(getDb(), 'sessions', userId, 'records', Date.now().toString());
  await setDoc(ref, {
    topic,
    score,
    feedback,
    completedAt: new Date().toISOString(),
  });
};

/**
 * Loads the most recent session record for a user from Firestore.
 * @param userId - Firebase UID of the authenticated user.
 * @returns The session data as a key-value map, or null if no session exists.
 * @throws {Error} When the Firestore read fails due to network or permission errors.
 */
export const getLastSession = async (userId: string): Promise<Record<string, unknown> | null> => {
  const ref = doc(getDb(), 'sessions', userId, 'meta', 'latest');
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};
