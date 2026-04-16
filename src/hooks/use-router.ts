import { useState, useEffect, useCallback } from 'react';

interface Route {
  path: string;
  noteId: string | null;
}

function parsePath(): Route {
  const pathname = window.location.pathname;
  if (pathname === '/') {
    return { path: '/', noteId: null };
  }
  const noteMatch = pathname.match(/^\/notes\/(.+)$/);
  if (noteMatch) {
    return { path: '/notes/:id', noteId: noteMatch[1] };
  }
  return { path: '/not-found', noteId: null };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parsePath);

  useEffect(() => {
    const handlePopState = () => setRoute(parsePath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState(null, '', path);
    setRoute(parsePath());
  }, []);

  return { ...route, navigate };
}
