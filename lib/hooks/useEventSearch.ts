'use client';

import { useState } from 'react';
import { searchEventsFromAPI } from '@/lib/services/eventService';
import { LocalEvent } from '@/lib/types';

export function useEventSearch() {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (keyword: string, city?: string) => {
    if (!keyword.trim()) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await searchEventsFromAPI(keyword, city);

    if (result.error) {
      setError(result.error);
      setEvents([]);
    } else {
      setEvents(result.events);
    }

    setLoading(false);
  };

  const clearResults = () => {
    setEvents([]);
    setError(null);
  };

  return {
    events,
    loading,
    error,
    search,
    clearResults,
  };
}

