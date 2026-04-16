import { useState } from 'react';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const variant = getCookie('notepad-variant');

  if (variant !== 'pro' || dismissed) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-blue-600 px-4 py-2 text-center text-sm text-white">
      <span>
        Try <strong>Notepad Pro</strong> &mdash; AI-powered search is here.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="rounded px-1.5 py-0.5 text-blue-200 underline transition-colors hover:text-white"
        aria-label="Dismiss promotional banner"
      >
        Dismiss
      </button>
    </div>
  );
}
