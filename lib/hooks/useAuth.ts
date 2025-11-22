'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/config/firebase';
import { AuthUser } from '@/lib/types';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/types';
import { registerUser, loginUser, logoutUser } from '@/lib/services/authService';
import { RegisterData, LoginData } from '@/lib/types';

/**
 * Convert Firebase User to AuthUser
 */
const mapFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

/**
 * Custom hook for authentication
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage first for faster initial load
    const storedUser = getStorageItem<AuthUser>(STORAGE_KEYS.AUTH_USER);
    if (storedUser) {
      setUser(storedUser);
    }

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        const authUser = mapFirebaseUser(firebaseUser);
        setUser(authUser);
        setLoading(false);
        
        // Sync with localStorage
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

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };
}

