import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pendingArgsRef.current !== null) {
        callbackRef.current(...pendingArgsRef.current);
        pendingArgsRef.current = null;
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      pendingArgsRef.current = args;
      timeoutRef.current = setTimeout(() => {
        pendingArgsRef.current = null;
        callbackRef.current(...args);
      }, delayMs);
    },
    [delayMs],
  );
}
