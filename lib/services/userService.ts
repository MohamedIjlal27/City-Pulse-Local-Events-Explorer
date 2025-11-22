/**
 * User Service - Business logic for managing user data and preferences
 */

import { UserPreferences } from '@/lib/types';
import { getStorageItem, setStorageItem } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/types';

/**
 * Get user preferences from localStorage
 */
export const getUserPreferences = (): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    favoriteCategories: [],
    savedEvents: [],
    notificationsEnabled: false,
  };

  return getStorageItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES) ?? defaultPreferences;
};

/**
 * Update user preferences
 */
export const updateUserPreferences = (
  preferences: Partial<UserPreferences>
): boolean => {
  const currentPreferences = getUserPreferences();
  const updatedPreferences: UserPreferences = {
    ...currentPreferences,
    ...preferences,
  };
  return setStorageItem(STORAGE_KEYS.USER_PREFERENCES, updatedPreferences);
};

/**
 * Add a favorite category
 */
export const addFavoriteCategory = (category: string): boolean => {
  const preferences = getUserPreferences();
  if (preferences.favoriteCategories.includes(category)) {
    return false; // Already a favorite
  }

  return updateUserPreferences({
    favoriteCategories: [...preferences.favoriteCategories, category],
  });
};

/**
 * Remove a favorite category
 */
export const removeFavoriteCategory = (category: string): boolean => {
  const preferences = getUserPreferences();
  return updateUserPreferences({
    favoriteCategories: preferences.favoriteCategories.filter(
      (cat) => cat !== category
    ),
  });
};

/**
 * Get recent searches
 */
export const getRecentSearches = (): string[] => {
  return getStorageItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES) ?? [];
};

/**
 * Add a recent search
 */
export const addRecentSearch = (search: string, maxItems: number = 10): boolean => {
  const recentSearches = getRecentSearches();
  
  // Remove if already exists
  const filtered = recentSearches.filter((s) => s !== search);
  
  // Add to beginning
  const updated = [search, ...filtered].slice(0, maxItems);
  
  return setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
};

/**
 * Clear recent searches
 */
export const clearRecentSearches = (): boolean => {
  return setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, []);
};

