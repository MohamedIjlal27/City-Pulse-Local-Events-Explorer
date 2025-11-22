'use client';

import { useState, useEffect } from 'react';
import { getAvailableCities } from '@/lib/services/eventService';
import { getStorageItem, setStorageItem } from '@/lib/utils/storage';

const CITIES_STORAGE_KEY = 'available_cities';
const CITIES_CACHE_EXPIRY = 24 * 60 * 60 * 1000;

interface CitiesCache {
  cities: string[];
  timestamp: number;
}

export function useCities() {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCities = async () => {
      const cached = getStorageItem<CitiesCache>(CITIES_STORAGE_KEY);
      const now = Date.now();

      if (cached && cached.timestamp && now - cached.timestamp < CITIES_CACHE_EXPIRY) {
        setCities(cached.cities);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getAvailableCities();

      if (result.error) {
        setError(result.error);
        if (cached?.cities) {
          setCities(cached.cities);
        }
      } else {
        setCities(result.cities);
        setStorageItem(CITIES_STORAGE_KEY, {
          cities: result.cities,
          timestamp: now,
        });
      }

      setLoading(false);
    };

    loadCities();
  }, []);

  return { cities, loading, error };
}

