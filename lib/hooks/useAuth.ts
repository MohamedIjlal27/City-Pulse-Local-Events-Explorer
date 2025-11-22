'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/config/firebase';
import { AuthUser } from '@/lib/types';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/types';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendEmailSignInLink,
  signInWithEmailLinkComplete,
  checkIsSignInWithEmailLink,
  getStoredEmailForSignIn,
  signInWithGoogle,
} from '@/lib/services/authService';
import { RegisterData, LoginData, EmailLinkActionCodeSettings } from '@/lib/types';
import { ActionCodeSettings } from 'firebase/auth';
import { mapFirebaseUser } from '@/lib/utils/authHelpers';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getStorageItem<AuthUser>(STORAGE_KEYS.AUTH_USER);
    if (storedUser) {
      setUser(storedUser);
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        const authUser = mapFirebaseUser(firebaseUser);
        setUser(authUser);
        setLoading(false);
        
        if (authUser) {
          setStorageItem(STORAGE_KEYS.AUTH_USER, authUser);
        } else {
          removeStorageItem(STORAGE_KEYS.AUTH_USER);
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const register = async (data: RegisterData) => {
    setError(null);
    setLoading(true);
    const result = await registerUser(data);
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setUser(result.user);
    return { success: true, user: result.user };
  };

  const login = async (data: LoginData) => {
    setError(null);
    setLoading(true);
    const result = await loginUser(data);
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setUser(result.user);
    return { success: true, user: result.user };
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    const result = await logoutUser();
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setUser(null);
    return { success: true };
  };

  const sendEmailLink = async (
    email: string,
    actionCodeSettings: EmailLinkActionCodeSettings
  ) => {
    setError(null);
    setLoading(true);
    
    const settings: ActionCodeSettings = {
      url: actionCodeSettings.url,
      handleCodeInApp: actionCodeSettings.handleCodeInApp,
      ...(actionCodeSettings.iOS && { iOS: actionCodeSettings.iOS }),
      ...(actionCodeSettings.android && { android: actionCodeSettings.android }),
      ...(actionCodeSettings.linkDomain && { linkDomain: actionCodeSettings.linkDomain }),
    };
    
    const result = await sendEmailSignInLink(email, settings);
    setLoading(false);
    
    if (!result.success) {
      setError(result.error || 'Failed to send email link');
      return { success: false, error: result.error };
    }
    
    return { success: true };
  };

  const completeEmailLinkSignIn = async (email: string, emailLink: string) => {
    setError(null);
    setLoading(true);
    const result = await signInWithEmailLinkComplete(email, emailLink);
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setUser(result.user);
    return { success: true, user: result.user };
  };

  const isEmailLink = (url: string) => {
    return checkIsSignInWithEmailLink(url);
  };

  const getStoredEmail = () => {
    return getStoredEmailForSignIn();
  };

  const signInWithGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setUser(result.user);
    return { success: true, user: result.user };
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    sendEmailLink,
    completeEmailLinkSignIn,
    isEmailLink,
    getStoredEmail,
    signInWithGoogle: signInWithGoogleAuth,
    isAuthenticated: !!user,
  };
}

