'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/utils/i18n';
import { ErrorAlert, GoogleSignInButton, Divider } from '@/lib/components/forms';

export default function LoginPage() {
  const router = useRouter();
  const { login, signInWithGoogle, loading, error } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email || !formData.password) {
      setFormError(t('pleaseFillAllFields'));
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      router.push('/');
    } else {
      setFormError(result.error || t('loginFailed'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    const result = await signInWithGoogle();
    
    if (result.success) {
      router.push('/');
    } else {
      setFormError(result.error || t('googleSignInFailed'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-black dark:text-white">
            {t('welcomeBack')}
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
            {t('signInToAccount')}
          </p>

          <ErrorAlert message={error || formError} className="mb-4" />

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
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>

          <div className="mt-6">
            <Divider text={t('orContinueWith')} className="mb-6" />
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              disabled={loading}
              label={t('signInWithGoogle')}
            />
          </div>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t('dontHaveAccount')}{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t('signUp')}
              </Link>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                  {t('or')}
                </span>
              </div>
            </div>
            <Link
              href="/login/email-link"
              className="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t('signInWithEmailLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

