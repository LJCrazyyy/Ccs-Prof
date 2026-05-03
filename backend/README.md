# Backend: Firebase emulator vs Production

This document explains how to run the backend against the local Firebase emulators or real production Firebase.

## Using the Local Emulators (recommended for development)

1. Copy the template to a local env file:

```bash
cp .env.example .env
```

2. Ensure the following are set in `.env` (these are the defaults in `.env.example`):

- `FIREBASE_USE_EMULATOR=true`
- `FIRESTORE_EMULATOR_HOST=127.0.0.1:8081`
- `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`

3. Start the Firebase emulators (from the `backend` folder):

```bash
cd backend
npx firebase emulators:start --only firestore,auth
```

4. In a separate terminal, start the backend app:

```bash
cd backend
npm start
```

Notes:
- The backend will detect `FIREBASE_USE_EMULATOR=true` or a non-empty `FIRESTORE_EMULATOR_HOST` and connect to the emulator.
- If emulators are running on different ports/hosts, update `FIRESTORE_EMULATOR_HOST` and `FIREBASE_AUTH_EMULATOR_HOST` accordingly.

## Using Production Firebase

1. Do NOT set `FIREBASE_USE_EMULATOR=true` and ensure `FIRESTORE_EMULATOR_HOST` is empty.

2. Provide service account values to allow the Firebase Admin SDK to authenticate:

- `FIREBASE_PROJECT_ID` (required)
- `FIREBASE_CLIENT_EMAIL` (service account email)
- `FIREBASE_PRIVATE_KEY` (the private key PEM; newlines should be escaped in environment files)

Example snippet in `.env` (DO NOT commit real keys):

```bash
FIREBASE_USE_EMULATOR=false
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_CLIENT_EMAIL=your-sa@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

3. Start the backend:

```bash
cd backend
npm start
```

## Enforcing Production at Runtime

If you want the backend process itself to refuse to run if it would connect to local emulators, set:

- `FIREBASE_ENFORCE_PRODUCTION=true`

With this flag the backend will throw and exit if it detects `FIREBASE_USE_EMULATOR=true` or a non-empty `FIRESTORE_EMULATOR_HOST`, or if service-account credentials are not present. This prevents accidental reads/writes to local emulator data when you intend to operate against real Firebase.

Example:

```bash
FIREBASE_ENFORCE_PRODUCTION=true npm start
```


## Troubleshooting

- If the backend appears to be connecting to localhost when you expect production, check `backend/src/firestore.js` which prefers `FIREBASE_USE_EMULATOR=true` or a non-empty `FIRESTORE_EMULATOR_HOST` to decide emulator usage.
- Verify `.env` values and restart the backend after changing env vars.
