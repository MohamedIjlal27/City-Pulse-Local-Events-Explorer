/**
 * Firebase configuration and initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured()) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    if (typeof window !== 'undefined') {
      console.warn(
        'Firebase is not properly configured. Please check your .env.local file. See FIREBASE_SETUP.md for instructions.'
      );
    }
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn(
      'Firebase environment variables are not set. Please configure Firebase in .env.local. See FIREBASE_SETUP.md for instructions.'
    );
  }
}

// Export auth with type assertion - will be null if not configured
export { auth };

// Export app
export default app;

