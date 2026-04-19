import 'dotenv/config';
import admin from 'firebase-admin';

const requiredEnv = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing Firebase Admin environment variables: ${missing.join(', ')}`);
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const firestore = admin.firestore();
