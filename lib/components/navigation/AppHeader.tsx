'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/utils/i18n';
import { UserProfileLink } from './UserProfileLink';

export function AppHeader() {
  const { user, isAuthenticated } = useAuth();
  const { language, toggleLanguage, t, mounted } = useLanguage();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-lg">CP</span>
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-600 transition-all">
                  {t('cityPulse')}
                </div>
                <span className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400 font-normal -mt-0.5">
                  {t('localEventsExplorer')}
                </span>
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <>
                <Link
                  href="/events"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                >
                  <span className="mr-1.5">📅</span>
                  {t('events')}
                </Link>
                {user && <UserProfileLink user={user} />}
              </>
            )}

            {mounted && (
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
                aria-label={t('language')}
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

