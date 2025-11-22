'use client';

import { useState, useEffect, useRef } from 'react';
import { searchEventsFromAPI } from '@/lib/services/eventService';
import { LocalEvent } from '@/lib/types';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export function useEventSearch(locale: string = 'en-us') {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<string>('');
  const previousLocaleRef = useRef(locale);
  const searchParamsRef = useRef<{ keyword: string; city?: string; page: number } | null>(null);

  const performSearch = async (keyword: string, city: string | undefined, page: number, searchLocale: string) => {
    setLoading(true);
    setError(null);

    const result = await searchEventsFromAPI(keyword, city, 20, page, searchLocale);

    if (result.error) {
      setError(result.error);
      setEvents([]);
      setPagination(null);
    } else {
      setEvents(result.events);
      setPagination(result.pagination);
    }

    setLoading(false);
  };

  const search = async (keyword: string, city?: string, page: number = 0) => {
    if (!keyword.trim()) {
      setEvents([]);
      setPagination(null);
      setCurrentKeyword('');
      setCurrentCity('');
      searchParamsRef.current = null;
      return;
    }

    setCurrentKeyword(keyword);
    setCurrentCity(city || '');
    searchParamsRef.current = { keyword, city, page };
    await performSearch(keyword, city, page, locale);
  };

  useEffect(() => {
    if (previousLocaleRef.current !== locale && searchParamsRef.current) {
      const { keyword, city, page } = searchParamsRef.current;
      performSearch(keyword, city, page, locale);
    }
    previousLocaleRef.current = locale;
  }, [locale]);

  const goToPage = async (page: number) => {
    if (currentKeyword && pagination && page >= 0 && page < pagination.totalPages) {
      await search(currentKeyword, currentCity || undefined, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (pagination && pagination.currentPage < pagination.totalPages - 1) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const prevPage = () => {
    if (pagination && pagination.currentPage > 0) {
      goToPage(pagination.currentPage - 1);
    }
  };

  const clearResults = () => {
    setEvents([]);
    setError(null);
    setPagination(null);
    setCurrentKeyword('');
    setCurrentCity('');
  };

  return {
    events,
    loading,
    error,
    pagination,
    search,
    goToPage,
    nextPage,
    prevPage,
    clearResults,
  };
}

