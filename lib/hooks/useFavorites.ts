'use client';

import { useState, useEffect } from 'react';
import { LocalEvent } from '@/lib/types';
import { getSavedEvents, saveEvent, removeSavedEvent, isEventSaved } from '@/lib/services/eventService';

export function useFavorites() {
  const [favorites, setFavorites] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getSavedEvents();
    setFavorites(saved);
    setLoading(false);
  }, []);

  const addFavorite = (event: LocalEvent) => {
    const success = saveEvent(event);
    if (success) {
      setFavorites((prev) => [...prev, event]);
    }
    return success;
  };

  const removeFavorite = (eventId: string) => {
    const success = removeSavedEvent(eventId);
    if (success) {
      setFavorites((prev) => prev.filter((e) => e.id !== eventId));
    }
    return success;
  };

  const toggleFavorite = (event: LocalEvent) => {
    const isCurrentlyFavorite = favorites.some((e) => e.id === event.id);
    if (isCurrentlyFavorite) {
      removeFavorite(event.id);
      return false;
    } else {
      addFavorite(event);
      return true;
    }
  };

  const checkIsFavorite = (eventId: string): boolean => {
    return favorites.some((e) => e.id === eventId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    checkIsFavorite,
  };
}

