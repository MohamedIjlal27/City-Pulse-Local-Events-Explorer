/**
 * LocalStorage utility wrapper for Next.js
 * Handles SSR safety and provides type-safe storage operations
 */

type StorageKey = string;

/**
 * Check if we're in a browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Get item from localStorage
 */
export const getStorageItem = <T>(key: StorageKey): T | null => {
  if (!isBrowser()) return null;

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
};

/**
 * Set item in localStorage
 */
export const setStorageItem = <T>(key: StorageKey, value: T): boolean => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: StorageKey): boolean => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 */
export const clearStorage = (): boolean => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get all keys from localStorage
 */
export const getStorageKeys = (): string[] => {
  if (!isBrowser()) return [];

  try {
    return Object.keys(window.localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

