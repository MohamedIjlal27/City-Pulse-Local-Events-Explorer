'use client';

interface ErrorAlertProps {
  message: string | null;
  className?: string;
}

export function ErrorAlert({ message, className = '' }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      className={`p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded ${className}`}
    >
      {message}
    </div>
  );
}

