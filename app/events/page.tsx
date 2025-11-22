'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEventSearch } from '@/lib/hooks/useEventSearch';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useLanguage, translations } from '@/lib/utils/i18n';
import Link from 'next/link';
import { LocalEvent } from '@/lib/types';

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const { events, loading: searchLoading, error: searchError, search } = useEventSearch();
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const { language, toggleLanguage, t } = useLanguage();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCity, setSearchCity] = useState('');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-black dark:text-white"
            >
              City Pulse
            </Link>
            <nav className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              {isAuthenticated && (
                <Link
                  href="/profile"
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                >
                  {t('profile')}
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-6">
            {t('browseEvents')}
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              search(searchKeyword, searchCity);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder={t('cityPlaceholder')}
              className="w-full sm:w-48 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            <button
              type="submit"
              disabled={searchLoading || !searchKeyword.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {searchLoading ? t('search') + '...' : t('search')}
            </button>
          </form>

          {searchError && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded text-sm">
              {searchError}
            </div>
          )}
        </div>

        {events.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
              {t('searchResults')} ({events.length})
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  toggleFavorite={toggleFavorite}
                  checkIsFavorite={checkIsFavorite}
                  t={t}
                />
              ))}
            </div>
          </div>
        ) : !searchLoading && searchKeyword ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              {t('noResults')}
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
              Try a different keyword or city
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              {t('searchEvents')}
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
              Enter a keyword and optionally a city to find events
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function EventCard({
  event,
  toggleFavorite,
  checkIsFavorite,
  t,
}: {
  event: LocalEvent;
  toggleFavorite: (event: LocalEvent) => boolean;
  checkIsFavorite: (eventId: string) => boolean;
  t: (key: keyof typeof translations.en) => string;
}) {
  const { isAuthenticated } = useAuth();
  const isFav = checkIsFavorite(event.id);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(event);
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="rounded-lg bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        )}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-zinc-900/90 rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors"
            aria-label={isFav ? t('unfavorite') : t('favorite')}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-lg font-semibold text-black dark:text-white line-clamp-2">
              {event.title}
            </h4>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
            {event.description}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-zinc-600 dark:text-zinc-400">
              <span className="mr-2">📅</span>
              {formatDate(event.date)} {event.time && `at ${event.time}`}
            </div>
            <div className="flex items-center text-zinc-600 dark:text-zinc-400">
              <span className="mr-2">📍</span>
              {event.location}
            </div>
            {event.price && (
              <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                <span className="mr-2">💰</span>
                From ${event.price}
              </div>
            )}
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                {event.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

