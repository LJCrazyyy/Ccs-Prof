import 'dotenv/config';
import admin from 'firebase-admin';

console.log('[firestore] Initializing Firebase Admin SDK...');

const hasServiceAccountEnv = Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
const shouldUseEmulator =
  String(process.env.FIREBASE_USE_EMULATOR ?? '').toLowerCase() === 'true' ||
  Boolean(process.env.FIRESTORE_EMULATOR_HOST);
const emulatorHostEnv = process.env.FIRESTORE_EMULATOR_HOST;
const hasEmulatorHost = Boolean(emulatorHostEnv);
const enforceProduction = String(process.env.FIREBASE_ENFORCE_PRODUCTION ?? '').toLowerCase() === 'true';
const projectId = process.env.FIREBASE_PROJECT_ID;

console.log('[firestore] Config:', {
  shouldUseEmulator,
  hasEmulatorHost,
  projectId,
  hasServiceAccountEnv,
  emulatorHostEnv,
  enforceProduction,
});

if (!projectId) {
  throw new Error('Missing Firebase Admin environment variable: FIREBASE_PROJECT_ID');
}

if (!admin.apps.length) {
  console.log('[firestore] Initializing Firebase Admin app...');
  const appOptions = {
    projectId,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };

  if (shouldUseEmulator) {
    const host = emulatorHostEnv || '127.0.0.1:8081';
    console.log('[firestore] Using emulator for Firestore', { host });
    if (enforceProduction) {
      throw new Error('FIREBASE_ENFORCE_PRODUCTION=true but emulator usage detected. Clear emulator env vars to connect to production.');
    }
    admin.initializeApp(appOptions);
    process.env.FIRESTORE_EMULATOR_HOST = host;
    process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
  } else {
    console.log('[firestore] Using production Firebase');
    admin.initializeApp({
      ...appOptions,
      credential: hasServiceAccountEnv
        ? admin.credential.cert({
            projectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          })
        : admin.credential.applicationDefault(),
    });
  }
  console.log('[firestore] Firebase Admin app initialized');
} else {
  console.log('[firestore] Firebase Admin app already initialized');
}

console.log('[firestore] Getting Firestore instance...');
export const firestore = admin.firestore();
  // Log where we're connected for easier debugging.
  if (shouldUseEmulator) {
    console.log('[firestore] Firestore instance connected to emulator at', process.env.FIRESTORE_EMULATOR_HOST);
  } else {
    console.log('[firestore] Firestore instance connected to production project:', projectId);
    if (enforceProduction) {
      // Ensure no emulator envs or accidental emulator flags remain set.
      if (hasEmulatorHost) {
        throw new Error('FIREBASE_ENFORCE_PRODUCTION=true but FIRESTORE_EMULATOR_HOST is set. Clear it to use production.');
      }
      if (String(process.env.FIREBASE_USE_EMULATOR ?? '').toLowerCase() === 'true') {
        throw new Error('FIREBASE_ENFORCE_PRODUCTION=true but FIREBASE_USE_EMULATOR is true. Set it to false to use production.');
      }
      if (!hasServiceAccountEnv && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        throw new Error('FIREBASE_ENFORCE_PRODUCTION=true but no service account credentials found. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY or provide GOOGLE_APPLICATION_CREDENTIALS.');
      }
    }
  }
  console.log('[firestore] Firestore instance ready');
