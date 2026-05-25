'use client';

import { useThemeStore } from '@/lib/stores/theme';
import type { Theme } from '@/types';

const themeIcons: Record<Theme, string> = {
  system: '💻',
  light: '☀️',
  dark: '🌙',
};

const themeOrder: Theme[] = ['system', 'light', 'dark'];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const next = () => {
    const idx = themeOrder.indexOf(theme);
    setTheme(themeOrder[(idx + 1) % themeOrder.length]);
  };

  return (
    <button
      onClick={next}
      className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
      aria-label={`Theme: ${theme}`}
    >
      <span className="text-base">{themeIcons[theme]}</span>
    </button>
  );
}
