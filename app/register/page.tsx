'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/utils/i18n';
import { ErrorAlert, GoogleSignInButton, Divider } from '@/lib/components/forms';

export default function RegisterPage() {
  const router = useRouter();
  const { register, signInWithGoogle, loading, error } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setFormError(t('pleaseFillRequiredFields'));
      return;
    }

    if (formData.password.length < 6) {
      setFormError(t('passwordMustBeSixChars'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError(t('passwordsDontMatch'));
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      displayName: formData.displayName || undefined,
    });

    if (result.success) {
      router.push('/');
    } else {
      setFormError(result.error || t('registrationFailed'));
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
            {t('createAccount')}
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
            {t('signUpToGetStarted')}
          </p>

          <ErrorAlert message={error || formError} className="mb-4" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                {t('displayName')}
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="John Doe"
              />
            </div>

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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {t('passwordMinLength')}
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                {t('confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
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
              {loading ? t('creatingAccount') : t('createAccount')}
            </button>
          </form>

          <div className="mt-6">
            <Divider text={t('orContinueWith')} className="mb-6" />
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              disabled={loading}
              label={t('signUpWithGoogle')}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

