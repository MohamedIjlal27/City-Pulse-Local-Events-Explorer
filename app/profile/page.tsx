'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useLanguage } from '@/lib/utils/i18n';
import { AppHeader } from '@/lib/components/navigation';
import { ErrorAlert } from '@/lib/components/forms';
import { LocalEvent } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { language, t, isRTL } = useLanguage();

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
      <AppHeader />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-6 mb-6">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || user.email || t('user')}
                className="w-24 h-24 rounded-full object-cover border-4 border-zinc-200 dark:border-zinc-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold border-4 border-zinc-200 dark:border-zinc-700">
                {(user?.displayName || user?.email || 'U')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                {t('profile')}
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {user?.displayName || user?.email || t('user')}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {t('welcome')}
              </label>
              <p className="text-lg text-black dark:text-white">
                {user?.displayName || user?.email || t('user')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {t('email')}
              </label>
              <p className="text-lg text-black dark:text-white">{user?.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {t('language')}
              </label>
              <p className="text-lg text-black dark:text-white">
                {language === 'en' ? t('english') : t('arabic')} ({isRTL ? 'RTL' : 'LTR'})
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
  const { t, formatDateShort } = useLanguage();


  return (
    <Link href={`/events/${event.id}`}>
      <div className="h-full flex flex-col rounded-lg bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800 flex-shrink-0">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
              <span className="text-4xl">📅</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2 line-clamp-2 flex-1">
            {event.title}
          </h3>
          <div className="space-y-2 text-sm flex-1">
            <p className="text-zinc-600 dark:text-zinc-400">
              {formatDateShort(event.date)} {event.time && `${t('at')} ${event.time}`}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 truncate">
              📍 {event.location}
            </p>
          </div>
          <div className="mt-3 flex-shrink-0">
            <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
              {event.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

