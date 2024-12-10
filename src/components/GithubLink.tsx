/**
 * A button component that links to the project's GitHub repository.
 * Styled to match the theme toggle button with Catppuccin colors.
 */

import { Github } from 'lucide-react';

interface GithubLinkProps {
  url: string;
}

export const GithubLink: React.FC<GithubLinkProps> = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-20 p-3 rounded-xl bg-[var(--latte-base)] dark:bg-[var(--mocha-mantle)] hover:bg-[var(--latte-surface0)] dark:hover:bg-[var(--mocha-surface0)] transition-all duration-300 shadow-lg hover:shadow-xl"
      aria-label="View source on GitHub"
    >
      <Github size={20} className="text-[var(--latte-mauve)] dark:text-[var(--mocha-mauve)]" />
    </a>
  );
}; 