'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/utils/i18n';

export default function SplashPage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        router.push('/home');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 px-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 animate-pulse">
          {t('cityPulse')}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8">
          {t('localEventsExplorer')}
        </p>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
      </div>
    </div>
  );
}

