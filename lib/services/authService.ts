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
} from 'firebase/auth';
import { auth } from '@/lib/config/firebase';
import { RegisterData, LoginData, AuthUser } from '@/lib/types';
import { setStorageItem, removeStorageItem } from '@/lib/utils/storage';
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

