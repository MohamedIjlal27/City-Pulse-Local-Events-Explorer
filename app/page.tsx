'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEventSearch } from '@/lib/hooks/useEventSearch';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useCities } from '@/lib/hooks/useCities';
import { useLanguage, translations } from '@/lib/utils/i18n';
import Link from 'next/link';
import { LocalEvent } from '@/lib/types';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const { events, loading: searchLoading, error: searchError, search } = useEventSearch();
  const { favorites, toggleFavorite, checkIsFavorite } = useFavorites();
  const { cities, loading: citiesLoading } = useCities();
  const { language, toggleLanguage, t, formatDateShort, mounted } = useLanguage();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCity, setSearchCity] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-black dark:text-white">
                {t('cityPulse')}
              </h1>
              <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                {t('localEventsExplorer')}
              </span>
            </div>
            <nav className="flex items-center gap-4">
              {mounted && (
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  {language === 'en' ? 'العربية' : 'English'}
                </button>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                  >
                    {t('profile')}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl md:text-6xl">
              {t('discoverEvents')}
              <br />
              <span className="text-blue-600 dark:text-blue-400">
                {t('inYourCity')}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {t('exploreDescription')}
            </p>

            <div className="mt-10 max-w-2xl mx-auto">
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
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full sm:w-48 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                  disabled={citiesLoading}
                >
                  <option value="">{t('cityPlaceholder')}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
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

            {events.length > 0 && (
              <div className="mt-12 max-w-7xl mx-auto">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                  {t('searchResults')} ({events.length})
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} toggleFavorite={toggleFavorite} checkIsFavorite={checkIsFavorite} isFavorite={checkIsFavorite(event.id)} t={t} formatDateShort={formatDateShort} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isAuthenticated ? (
                <Link
                  href="/events"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  Browse Events
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                  >
                    {t('getStarted')}
                  </Link>
                  <Link
                    href="/login"
                    className="text-base font-semibold leading-6 text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {t('login')} <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="text-3xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {t('discoverEventsTitle')}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t('exploreDescription')}
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {t('localFocus')}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t('exploreDescription')}
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="text-3xl mb-4">💾</div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {t('saveFavorites')}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Save events you're interested in and never miss out on what
                  matters to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {t('copyright')} {new Date().getFullYear()} {t('cityPulse')}. {t('allRightsReserved')}.
          </p>
        </div>
      </footer>
    </div>
  );
}

function EventCard({ 
  event, 
  toggleFavorite, 
  checkIsFavorite, 
  isFavorite,
  t,
  formatDateShort
}: { 
  event: LocalEvent;
  toggleFavorite: (event: LocalEvent) => boolean;
  checkIsFavorite: (eventId: string) => boolean;
  isFavorite: boolean;
  t: (key: keyof typeof translations.en) => string;
  formatDateShort: (date: string) => string;
}) {

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
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-zinc-900/90 rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors"
          aria-label={isFavorite ? t('unfavorite') : t('favorite')}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
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
              {formatDateShort(event.date)} {event.time && `${t('at')} ${event.time}`}
            </div>
            <div className="flex items-center text-zinc-600 dark:text-zinc-400">
              <span className="mr-2">📍</span>
              {event.location}
            </div>
            {event.price && (
              <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                <span className="mr-2">💰</span>
                {t('from')} ${event.price}
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
