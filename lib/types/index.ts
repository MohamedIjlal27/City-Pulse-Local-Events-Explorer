/**
 * Common TypeScript types and interfaces
 */

// Example: Event types for city pulse local events explorer
export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl?: string;
  price?: number;
  organizer?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
}

export interface UserPreferences {
  favoriteCategories: string[];
  savedEvents: string[];
  location?: string;
  notificationsEnabled: boolean;
}

export interface AppState {
  user: {
    preferences: UserPreferences;
    recentSearches: string[];
  };
  events: LocalEvent[];
  filters: {
    category?: string;
    dateRange?: {
      start: string;
      end: string;
    };
    location?: string;
  };
}

// Auth types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface EmailLinkActionCodeSettings {
  url: string;
  handleCodeInApp: boolean;
  iOS?: {
    bundleId: string;
  };
  android?: {
    packageName: string;
    installApp?: boolean;
    minimumVersion?: string;
  };
  linkDomain?: string;
}

// Storage keys type for type safety
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  SAVED_EVENTS: 'saved_events',
  RECENT_SEARCHES: 'recent_searches',
  APP_STATE: 'app_state',
  AUTH_USER: 'auth_user',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

