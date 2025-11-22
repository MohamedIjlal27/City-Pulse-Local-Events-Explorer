'use client';

import Link from 'next/link';
import { AuthUser } from '@/lib/types';

interface UserProfileLinkProps {
  user: AuthUser;
  className?: string;
}

export function UserProfileLink({ user, className = '' }: UserProfileLinkProps) {
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link
      href="/profile"
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 ${className}`}
    >
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center text-white text-sm font-semibold shadow-sm ring-2 ring-zinc-200 dark:ring-zinc-700">
          {initials}
        </div>
      )}
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:inline">
        {displayName}
      </span>
    </Link>
  );
}

