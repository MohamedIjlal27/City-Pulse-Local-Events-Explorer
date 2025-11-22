'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/utils/i18n';

export default function EmailLinkLoginPage() {
  const router = useRouter();
  const { sendEmailLink, loading, error } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError(t('pleaseEnterEmail'));
      return;
    }

    // Get the current origin for the redirect URL
    const redirectUrl = `${window.location.origin}/auth/verify-email`;

    const result = await sendEmailLink(email, {
      url: redirectUrl,
      handleCodeInApp: true,
    });

    if (result.success) {
      setEmailSent(true);
    } else {
      setFormError(result.error || t('failedToSendEmailLink'));
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
              {t('checkYourEmail')}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {t('emailSentTo')} <strong>{email}</strong>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
              {t('clickLinkInEmail')}
            </p>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4"
            >
              {t('sendAnotherEmail')}
            </button>
            <Link
              href="/login"
              className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-black dark:text-white">
            {t('signInWithEmailLinkTitle')}
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
            {t('enterEmailForLink')}
          </p>

          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
              {error || formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                {t('emailAddress')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {loading ? t('sending') : t('sendSignInLink')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t('backToPasswordLogin')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

