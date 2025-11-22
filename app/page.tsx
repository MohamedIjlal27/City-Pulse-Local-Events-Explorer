'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEventSearch } from '@/lib/hooks/useEventSearch';
import Link from 'next/link';
import { LocalEvent } from '@/lib/types';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const { events, loading: searchLoading, error: searchError, search } = useEventSearch();
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
                City Pulse
              </h1>
              <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                Local Events Explorer
              </span>
            </div>
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user?.email}
                  </span>
                  <Link
                    href="/events"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Explore Events
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Get Started
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
              Discover Local Events
              <br />
              <span className="text-blue-600 dark:text-blue-400">
                In Your City
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Explore exciting events happening around you. From concerts to
              workshops, find your next adventure with City Pulse.
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
                  placeholder="Search events (e.g., concerts, sports, theater)"
                  className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="City (optional)"
                  className="w-full sm:w-48 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                />
                <button
                  type="submit"
                  disabled={searchLoading || !searchKeyword.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
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
                  Search Results ({events.length})
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
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
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="text-base font-semibold leading-6 text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Sign In <span aria-hidden="true">→</span>
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
                  Discover Events
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Find concerts, workshops, meetups, and more happening in your
                  area.
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Local Focus
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Connect with your community and discover what's happening
                  nearby.
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="text-3xl mb-4">💾</div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Save Favorites
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
            © {new Date().getFullYear()} City Pulse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function EventCard({ event }: { event: LocalEvent }) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-lg bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
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
  );
}
