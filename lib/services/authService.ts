/**
 * Authentication Service - Firebase Auth business logic
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  ActionCodeSettings,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/config/firebase';
import { RegisterData, LoginData, AuthUser } from '@/lib/types';
import { setStorageItem, removeStorageItem, getStorageItem } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/types';

/**
 * Convert Firebase User to AuthUser
 */
const mapFirebaseUser = (user: User): AuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

/**
 * Register a new user
 */
export const registerUser = async (
  data: RegisterData
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> => {
  if (!auth) {
    return { user: null, error: 'Firebase is not configured. Please check your .env.local file.' };
  }

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Update display name if provided
    if (data.displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });
    }

    const authUser = mapFirebaseUser(userCredential.user);
    
    // Save user to localStorage
    setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);

    return { user: authUser, error: null };
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to register user';
    return { user: null, error: errorMessage };
  }
};

/**
 * Login user
 */
export const loginUser = async (
  data: LoginData
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> => {
  if (!auth) {
    return { user: null, error: 'Firebase is not configured. Please check your .env.local file.' };
  }

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const authUser = mapFirebaseUser(userCredential.user);
    
    // Save user to localStorage
    setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);

    return { user: authUser, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to login';
    
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { user: null, error: errorMessage };
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<{ error: null } | { error: string }> => {
  if (!auth) {
    // Still clear localStorage even if Firebase isn't configured
    removeStorageItem(STORAGE_KEYS.AUTH_USER);
    return { error: null };
  }

  try {
    await signOut(auth);
    
    // Remove user from localStorage
    removeStorageItem(STORAGE_KEYS.AUTH_USER);

    return { error: null };
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to logout';
    return { error: errorMessage };
  }
};

/**
 * Get current user from Firebase Auth
 */
export const getCurrentUser = (): User | null => {
  return auth?.currentUser ?? null;
};

/**
 * Send sign-in link to user's email (passwordless authentication)
 */
export const sendEmailSignInLink = async (
  email: string,
  actionCodeSettings: ActionCodeSettings
): Promise<{ success: boolean; error: string | null }> => {
  if (!auth) {
    return { success: false, error: 'Firebase is not configured. Please check your .env.local file.' };
  }

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    // Save email locally for later use
    setStorageItem('emailForSignIn', email);
    
    return { success: true, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to send sign-in link';
    
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Check if the current URL is a sign-in with email link
 */
export const checkIsSignInWithEmailLink = (url: string): boolean => {
  if (!auth) return false;
  return isSignInWithEmailLink(auth, url);
};

/**
 * Complete sign-in with email link
 */
export const signInWithEmailLinkComplete = async (
  email: string,
  emailLink: string
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> => {
  if (!auth) {
    return { user: null, error: 'Firebase is not configured. Please check your .env.local file.' };
  }

  try {
    const userCredential: UserCredential = await signInWithEmailLink(auth, email, emailLink);
    
    const authUser = mapFirebaseUser(userCredential.user);
    
    // Save user to localStorage
    setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);
    
    // Clear the stored email
    removeStorageItem('emailForSignIn');
    
    return { user: authUser, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in with email link';
    
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/invalid-action-code') {
      errorMessage = 'The sign-in link is invalid or has expired';
    } else if (error.code === 'auth/expired-action-code') {
      errorMessage = 'The sign-in link has expired. Please request a new one.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { user: null, error: errorMessage };
  }
};

/**
 * Get stored email for sign-in (from localStorage)
 */
export const getStoredEmailForSignIn = (): string | null => {
  return getStorageItem<string>('emailForSignIn');
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<
  { user: AuthUser; error: null } | { user: null; error: string }
> => {
  if (!auth) {
    return { user: null, error: 'Firebase is not configured. Please check your .env.local file.' };
  }

  try {
    const provider = new GoogleAuthProvider();
    // Add scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    const userCredential: UserCredential = await signInWithPopup(auth, provider);
    
    const authUser = mapFirebaseUser(userCredential.user);
    
    // Save user to localStorage
    setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);
    
    return { user: authUser, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in with Google';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by browser. Please allow popups for this site.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Only one popup request is allowed at a time';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with the same email address but different sign-in credentials';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { user: null, error: errorMessage };
  }
};

