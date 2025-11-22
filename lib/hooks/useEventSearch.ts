'use client';

import { useState } from 'react';
import { searchEventsFromAPI } from '@/lib/services/eventService';
import { addRecentSearch } from '@/lib/services/userService';
import { LocalEvent } from '@/lib/types';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export function useEventSearch() {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<string>('');

  const search = async (keyword: string, city?: string, page: number = 0) => {
    if (!keyword.trim()) {
      setEvents([]);
      setPagination(null);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentKeyword(keyword);
    setCurrentCity(city || '');

    if (page === 0) {
      const searchQuery = city ? `${keyword} in ${city}` : keyword;
      addRecentSearch(searchQuery);
    }

    const result = await searchEventsFromAPI(keyword, city, 10, page);

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

