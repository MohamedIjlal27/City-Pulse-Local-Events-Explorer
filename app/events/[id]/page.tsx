'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useLanguage } from '@/lib/utils/i18n';
import { AppHeader } from '@/lib/components/navigation';
import { MapPreview } from '@/lib/components/maps';
import { getEventByIdFromAPI } from '@/lib/services/eventService';
import { LocalEvent } from '@/lib/types';
import { ErrorAlert } from '@/lib/components/forms';

function EventDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const { t, isRTL, formatDate } = useLanguage();
  const [event, setEvent] = useState<LocalEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const eventId = params.id as string;
    if (!eventId) {
      setError(t('eventIdRequired'));
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);

      const result = await getEventByIdFromAPI(eventId);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result.event) {
        setEvent(result.event);
        setIsFav(checkIsFavorite(result.event.id));
      }

      setLoading(false);
    };

    fetchEvent();
  }, [params.id, checkIsFavorite]);

  const handleToggleFavorite = () => {
    if (!event) return;
    const newFavState = toggleFavorite(event);
    setIsFav(newFavState);
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">{t('search')}...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <ErrorAlert message={error || t('eventNotFound')} />
          <Link
            href="/home"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← {t('home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <AppHeader />
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 sm:h-14 items-center justify-between">
            <Link
              href="/events"
              className="text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-1 sm:gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">{t('events')}</span>
              <span className="sm:hidden">Back</span>
            </Link>
            {isAuthenticated && (
              <button
                onClick={handleToggleFavorite}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isFav
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {isFav ? '❤️ ' + t('unfavorite') : '🤍 ' + t('favorite')}
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {event.imageUrl && (
          <div className="mb-4 sm:mb-8 rounded-lg overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
            />
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            {event.title}
          </h1>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
              <span className="text-xl sm:text-2xl flex-shrink-0">📅</span>
              <div>
                <p className="font-medium text-sm sm:text-base">{formatDate(event.date)}</p>
                {event.time && <p className="text-xs sm:text-sm">{t('at')} {event.time}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <span className="text-xl sm:text-2xl flex-shrink-0">📍</span>
                <p className="font-medium text-sm sm:text-base break-words">{event.location}</p>
              </div>
              {event.latitude && event.longitude && (
                <div className="mt-4">
                  <MapPreview
                    latitude={event.latitude}
                    longitude={event.longitude}
                    title={event.title}
                  />
                </div>
              )}
            </div>

            {event.price && (
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <span className="text-xl sm:text-2xl flex-shrink-0">💰</span>
                <p className="text-sm sm:text-base">{t('from')} ${event.price}</p>
              </div>
            )}

            {event.organizer && (
              <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <span className="text-xl sm:text-2xl flex-shrink-0">🎤</span>
                <p className="text-sm sm:text-base break-words">{event.organizer}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs sm:text-sm font-medium">
                {event.category}
              </span>
              {event.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 sm:px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-xs sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 sm:pt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
              {t('eventDetails')}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      }
    >
      <EventDetailContent />
    </Suspense>
  );
}

