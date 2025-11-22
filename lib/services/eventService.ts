/**
 * Event Service - Business logic for managing events
 */

import { LocalEvent } from '@/lib/types';
import { getStorageItem, setStorageItem } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/types';

/**
 * Get all saved events from localStorage
 */
export const getSavedEvents = (): LocalEvent[] => {
  return getStorageItem<LocalEvent[]>(STORAGE_KEYS.SAVED_EVENTS) ?? [];
};

/**
 * Save an event to localStorage
 */
export const saveEvent = (event: LocalEvent): boolean => {
  const savedEvents = getSavedEvents();
  
  // Check if event already exists
  if (savedEvents.some((e) => e.id === event.id)) {
    return false; // Event already saved
  }

  const updatedEvents = [...savedEvents, event];
  return setStorageItem(STORAGE_KEYS.SAVED_EVENTS, updatedEvents);
};

/**
 * Remove an event from saved events
 */
export const removeSavedEvent = (eventId: string): boolean => {
  const savedEvents = getSavedEvents();
  const updatedEvents = savedEvents.filter((e) => e.id !== eventId);
  return setStorageItem(STORAGE_KEYS.SAVED_EVENTS, updatedEvents);
};

/**
 * Check if an event is saved
 */
export const isEventSaved = (eventId: string): boolean => {
  const savedEvents = getSavedEvents();
  return savedEvents.some((e) => e.id === eventId);
};

/**
 * Filter events by category
 */
export const filterEventsByCategory = (
  events: LocalEvent[],
  category: string
): LocalEvent[] => {
  return events.filter((event) => event.category === category);
};

/**
 * Filter events by date range
 */
export const filterEventsByDateRange = (
  events: LocalEvent[],
  startDate: string,
  endDate: string
): LocalEvent[] => {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return eventDate >= start && eventDate <= end;
  });
};

/**
 * Search events by query
 */
export const searchEvents = (
  events: LocalEvent[],
  query: string
): LocalEvent[] => {
  const lowerQuery = query.toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.location.toLowerCase().includes(lowerQuery) ||
      event.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

