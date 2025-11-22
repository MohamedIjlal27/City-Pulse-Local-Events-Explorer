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
      className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${className}`}
    >
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
      )}
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:inline">
        {displayName}
      </span>
    </Link>
  );
}

