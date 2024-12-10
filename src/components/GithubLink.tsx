/**
 * A GitHub link component that displays a GitHub icon with a link to the repository.
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
      className="p-3 rounded-xl bg-[var(--latte-base)] dark:bg-[var(--mocha-mantle)] hover:bg-[var(--latte-surface0)] dark:hover:bg-[var(--mocha-surface0)] transition-all duration-300 shadow-lg hover:shadow-xl"
      aria-label="View source on GitHub"
    >
      <Github size={20} />
    </a>
  );
}; 