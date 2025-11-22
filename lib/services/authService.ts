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
import { mapFirebaseUser, getAuthErrorMessage } from '@/lib/utils/authHelpers';
import { AUTH_ERRORS } from '@/lib/constants/errors';

export const registerUser = async (
  data: RegisterData
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> => {
  if (!auth) {
    return { user: null, error: AUTH_ERRORS.FIREBASE_NOT_CONFIGURED };
  }

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (data.displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });
    }

    const authUser = mapFirebaseUser(userCredential.user);
    
    if (!authUser) {
      return { user: null, error: 'Failed to get user information' };
    }
    
    setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);

    return { user: authUser, error: null };
  } catch (error: any) {
    const errorMessage = getAuthErrorMessage(error);
    return { user: null, error: errorMessage };
  }
};

export const loginUser = async (
  data: LoginData
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> => {
  if (!auth) {
    return { user: null, error: AUTH_ERRORS.FIREBASE_NOT_CONFIGURED };
  }

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const authUser = mapFirebaseUser(userCredential.user);
    
    if (!authUser) {
      return { user: null, error: 'Failed to get user information' };
    }
    
    setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);

    return { user: authUser, error: null };
  } catch (error: any) {
    const errorMessage = getAuthErrorMessage(error);
    return { user: null, error: errorMessage };
  }
};

export const logoutUser = async (): Promise<{ error: null } | { error: string }> => {
  if (!auth) {
    removeStorageItem(STORAGE_KEYS.AUTH_USER);
    return { error: null };
  }

  try {
    await signOut(auth);
    
    removeStorageItem(STORAGE_KEYS.AUTH_USER);

    return { error: null };
  } catch (error: any) {
    const errorMessage = getAuthErrorMessage(error);
    return { error: errorMessage };
  }
};

export const getCurrentUser = (): User | null => {
  return auth?.currentUser ?? null;
};

export const sendEmailSignInLink = async (
  email: string,
  actionCodeSettings: ActionCodeSettings
): Promise<{ success: boolean; error: string | null }> => {
  if (!auth) {
    return { success: false, error: AUTH_ERRORS.FIREBASE_NOT_CONFIGURED };
  }

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    setStorageItem('emailForSignIn', email);
    
    return { success: true, error: null };
  } catch (error: any) {
    const errorMessage = getAuthErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

export const checkIsSignInWithEmailLink = (url: string): boolean => {
  if (!auth) return false;
  return isSignInWithEmailLink(auth, url);
};

export const signInWithEmailLinkComplete = async (
  email: string,
  emailLink: string
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> => {
  if (!auth) {
    return { user: null, error: AUTH_ERRORS.FIREBASE_NOT_CONFIGURED };
  }

  try {
    const userCredential: UserCredential = await signInWithEmailLink(auth, email, emailLink);
    
    const authUser = mapFirebaseUser(userCredential.user);
    
    if (!authUser) {
      return { user: null, error: 'Failed to get user information' };
    }
    
    setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);
    
    removeStorageItem('emailForSignIn');
    
    return { user: authUser, error: null };
  } catch (error: any) {
    const errorMessage = getAuthErrorMessage(error);
    return { user: null, error: errorMessage };
  }
};

export const getStoredEmailForSignIn = (): string | null => {
  return getStorageItem<string>('emailForSignIn');
};

export const signInWithGoogle = async (): Promise<
  { user: AuthUser; error: null } | { user: null; error: string }
> => {
  if (!auth) {
    return { user: null, error: AUTH_ERRORS.FIREBASE_NOT_CONFIGURED };
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    const userCredential: UserCredential = await signInWithPopup(auth, provider);
    
    const authUser = mapFirebaseUser(userCredential.user);
    
    if (!authUser) {
      return { user: null, error: 'Failed to get user information' };
    }
    
    setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);
    
    return { user: authUser, error: null };
  } catch (error: any) {
    const errorMessage = getAuthErrorMessage(error);
    return { user: null, error: errorMessage };
  }
};

