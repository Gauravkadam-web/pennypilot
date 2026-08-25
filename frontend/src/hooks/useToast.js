// frontend/src/hooks/useToast.js
// Reusable in-page toast notification hook

import { useState, useCallback } from 'react';

/**
 * @returns {{ toasts: Array<{id: number, message: string, type: string}>, show: Function }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);

  return { toasts, show };
}
