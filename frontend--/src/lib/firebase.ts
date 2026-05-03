import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import { getAnalytics } from 'firebase/analytics';
import type { Auth } from 'firebase/auth';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig: Record<string, string | undefined> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseKeys: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingConfigKeys = requiredFirebaseKeys.filter((key) => !firebaseConfig[key]);

const envSetupHint = import.meta.env.PROD
  ? 'Set VITE_FIREBASE_* variables in Netlify Site settings > Environment variables, then redeploy.'
  : 'Create a frontend--/.env.local file from frontend--/.env.example.';

export const firebaseInitError = missingConfigKeys.length
  ? new Error(
      `Firebase configuration is not properly set. Missing environment variables: ${missingConfigKeys.join(
        ', '
      )}. ${envSetupHint}`
    )
  : null;

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (!firebaseInitError) {
  app = initializeApp(firebaseConfig as FirebaseOptions);
  // Disable Analytics if working offline or on restricted network
  // if (firebaseConfig.measurementId) {
  //   try {
  //     analytics = getAnalytics(app);
  //   } catch (error) {
  //     console.warn('Firebase Analytics initialization failed (likely network issue):', error);
  //   }
  // }
  auth = getAuth(app);
  const isDev = Boolean(import.meta.env.DEV);
  const useAuthEmulator = String(import.meta.env.VITE_USE_FIREBASE_AUTH_EMULATOR ?? '').toLowerCase() === 'true';
  const authEmulatorHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1';
  const authEmulatorPort = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT || '9099';
  if (isDev && useAuthEmulator) {
    connectAuthEmulator(auth, `http://${authEmulatorHost}:${authEmulatorPort}`, { disableWarnings: true });
  }
  db = getFirestore(app);
  const useFirestoreEmulator = String(import.meta.env.VITE_USE_FIRESTORE_EMULATOR ?? '').toLowerCase() === 'true';
  const firestoreEmulatorHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || '127.0.0.1';
  const firestoreEmulatorPort = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || '8081');
  if (isDev && useFirestoreEmulator) {
    try {
      connectFirestoreEmulator(db, firestoreEmulatorHost, Number.isFinite(firestoreEmulatorPort) ? firestoreEmulatorPort : 8081);
    } catch (error) {
      // Ignore duplicate emulator setup during fast refresh.
      console.warn('Firestore emulator setup skipped:', error);
    }
  }
  storage = getStorage(app);
} else {
  console.warn(firebaseInitError.message);
}

export { analytics, app, auth, db, storage };
export default app;
