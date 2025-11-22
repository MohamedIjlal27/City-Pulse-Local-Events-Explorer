'use client';

import { useLocalStorage } from './useLocalStorage';
import { UserPreferences, STORAGE_KEYS } from '@/lib/types';

const defaultPreferences: UserPreferences = {
  favoriteCategories: [],
  savedEvents: [],
  notificationsEnabled: false,
};

/**
 * Custom hook for managing user preferences
 */
export function useUserPreferences() {
  const [preferences, setPreferences, removePreferences] = useLocalStorage<UserPreferences>(
    STORAGE_KEYS.USER_PREFERENCES,
    defaultPreferences
  );

  const addFavoriteCategory = (category: string) => {
    if (!preferences.favoriteCategories.includes(category)) {
      setPreferences({
        ...preferences,
        favoriteCategories: [...preferences.favoriteCategories, category],
      });
    }
  };

  const removeFavoriteCategory = (category: string) => {
    setPreferences({
      ...preferences,
      favoriteCategories: preferences.favoriteCategories.filter(
        (cat) => cat !== category
      ),
    });
  };

  const toggleNotifications = () => {
    setPreferences({
      ...preferences,
      notificationsEnabled: !preferences.notificationsEnabled,
    });
  };

  const updateLocation = (location: string) => {
    setPreferences({
      ...preferences,
      location,
    });
  };

  return {
    preferences,
    setPreferences,
    removePreferences,
    addFavoriteCategory,
    removeFavoriteCategory,
    toggleNotifications,
    updateLocation,
  };
}

