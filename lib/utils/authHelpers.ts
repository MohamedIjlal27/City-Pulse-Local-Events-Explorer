import { User } from 'firebase/auth';
import { AuthUser } from '@/lib/types';

export const mapFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';

  const errorCodeMap: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-not-found': 'User not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/email-already-in-use': 'This email is already registered',
    'auth/weak-password': 'Password is too weak',
    'auth/popup-closed-by-user': 'Sign-in popup was closed',
    'auth/popup-blocked': 'Popup was blocked by browser. Please allow popups for this site.',
    'auth/cancelled-popup-request': 'Only one popup request is allowed at a time',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials',
    'auth/invalid-action-code': 'The sign-in link is invalid or has expired',
    'auth/expired-action-code': 'The sign-in link has expired. Please request a new one.',
    'auth/user-disabled': 'This account has been disabled',
  };

  if (error.code && errorCodeMap[error.code]) {
    return errorCodeMap[error.code];
  }

  return error.message || 'An error occurred. Please try again.';
};

