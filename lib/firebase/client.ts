import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const requiredFirebaseEnvKeys = Object.entries(firebaseConfig) as Array<
  [keyof typeof firebaseConfig, string | undefined]
>;

export function hasRequiredFirebaseEnv() {
  return requiredFirebaseEnvKeys.every(([, value]) => Boolean(value));
}

export function getFirebaseApp() {
  if (!hasRequiredFirebaseEnv()) {
    throw new Error(
      "Firebase is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* variables to your local environment.",
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
