/**
 * A theme toggle button component that switches between light and dark modes.
 * Uses Catppuccin Latte for light mode and Mocha for dark mode.
 * Features smooth transitions and appropriate icons for each theme.
 */

import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 p-3 rounded-xl bg-[var(--latte-base)] dark:bg-[var(--mocha-mantle)] hover:bg-[var(--latte-surface0)] dark:hover:bg-[var(--mocha-surface0)] transition-all duration-300 shadow-lg hover:shadow-xl"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={20} className="text-[var(--mocha-yellow)]" />
      ) : (
        <Moon size={20} className="text-[var(--latte-blue)]" />
      )}
    </button>
  );
};