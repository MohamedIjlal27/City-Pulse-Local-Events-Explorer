'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

function VerifyEmailContent() {
  const router = useRouter();
  const { completeEmailLinkSignIn, isEmailLink, getStoredEmail, loading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Get the full URL
    const currentUrl = window.location.href;
    
    // Check if this is an email link
    if (isEmailLink(currentUrl)) {
      // Try to get stored email
      const storedEmail = getStoredEmail();
      if (storedEmail) {
        setEmail(storedEmail);
        // Auto-complete sign-in if email is stored
        handleSignIn(storedEmail, currentUrl);
      }
    }
  }, []);

  const handleSignIn = async (userEmail: string, emailLink: string) => {
    setIsVerifying(true);
    setError(null);

    const result = await completeEmailLinkSignIn(userEmail, emailLink);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Failed to verify email link');
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUrl = window.location.href;
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    handleSignIn(email, currentUrl);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const isLink = isEmailLink(currentUrl);

  if (!isLink) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
              Invalid Link
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              This link is not a valid sign-in link. Please check your email for the correct link.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-black dark:text-white">
            Complete Sign In
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
            Please confirm your email address to complete sign in
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
              {error}
            </div>
          )}

          {isVerifying ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
              <p className="text-zinc-600 dark:text-zinc-400">Verifying your email link...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-black dark:text-white"
                  placeholder="you@example.com"
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Enter the email address where you received the sign-in link
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || isVerifying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                Complete Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
            <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

