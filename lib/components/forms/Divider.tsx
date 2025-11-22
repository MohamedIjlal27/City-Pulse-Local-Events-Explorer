'use client';

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text = 'Or', className = '' }: DividerProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
          {text}
        </span>
      </div>
    </div>
  );
}

