'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/utils/i18n';
import { UserProfileLink } from './UserProfileLink';

export function AppHeader() {
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage, t, mounted } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleLanguageDropdown = () => setLanguageDropdownOpen(!languageDropdownOpen);
  const closeLanguageDropdown = () => setLanguageDropdownOpen(false);

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    closeLanguageDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        closeLanguageDropdown();
      }
    };

    if (languageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageDropdownOpen]);

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/home"
            className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
            onClick={closeMobileMenu}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-base sm:text-lg">CP</span>
              </div>
              <div className="flex flex-col">
                <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-600 transition-all">
                  {t('cityPulse')}
                </div>
                <span className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400 font-normal -mt-0.5">
                  {t('localEventsExplorer')}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-3">
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              <span className="text-base">🏠</span>
              {t('home')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <span className="text-base">📅</span>
                  {t('events')}
                </Link>
                {user && <UserProfileLink user={user} />}
              </>
            )}

            {mounted && (
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
                  aria-label={t('language')}
                >
                  <span className="text-lg">🌐</span>
                  <span>{t('language')}</span>
                  <svg className={`w-4 h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
                        language === 'en'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {language === 'en' && '✓ '}English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ar')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
                        language === 'ar'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {language === 'ar' && '✓ '}العربية
                    </button>
                  </div>
                )}
              </div>
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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-200 dark:border-zinc-800">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/home"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
              >
                <span className="mr-2">🏠</span>
                {t('home')}
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/events"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                  >
                    <span className="mr-2">📅</span>
                    {t('events')}
                  </Link>
                  {user && (
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                    >
                      <span className="mr-2">👤</span>
                      {t('profile')}
                    </Link>
                  )}
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 rounded-lg transition-all text-center"
                  >
                    {t('register')}
                  </Link>
                </>
              )}

              {/* Language Selector in Mobile Menu */}
              {mounted && (
                <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {t('language')}
                  </div>
                  <button
                    onClick={() => {
                      handleLanguageChange('en');
                      closeMobileMenu();
                    }}
                    className={`w-full text-left flex items-center px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                      language === 'en'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {language === 'en' && <span className="mr-2">✓</span>}
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLanguageChange('ar');
                      closeMobileMenu();
                    }}
                    className={`w-full text-left flex items-center px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                      language === 'ar'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {language === 'ar' && <span className="mr-2">✓</span>}
                    <span>العربية</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

