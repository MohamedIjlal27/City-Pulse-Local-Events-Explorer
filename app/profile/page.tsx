'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useLanguage } from '@/lib/utils/i18n';
import { ErrorAlert } from '@/lib/components/forms';
import { LocalEvent } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { language, toggleLanguage, t, isRTL } = useLanguage();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              ← {t('home')}
            </Link>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-6">
            {t('profile')}
          </h1>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {t('welcome')}
              </label>
              <p className="text-lg text-black dark:text-white">
                {user?.displayName || user?.email || 'User'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Email
              </label>
              <p className="text-lg text-black dark:text-white">{user?.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Language
              </label>
              <p className="text-lg text-black dark:text-white">
                {language === 'en' ? 'English' : 'العربية'} ({isRTL ? 'RTL' : 'LTR'})
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            {t('logout')}
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            {t('savedEvents')} ({favorites.length})
          </h2>

          {favoritesLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            </div>
          ) : favorites.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
              {t('noResults')}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EventCard({ event }: { event: LocalEvent }) {
  const { t } = useLanguage();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            {formatDate(event.date)} {event.time && `at ${event.time}`}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            📍 {event.location}
          </p>
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
            {event.category}
          </span>
        </div>
      </div>
    </Link>
  );
}

