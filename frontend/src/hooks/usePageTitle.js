// frontend/src/hooks/usePageTitle.js
// Sets the browser tab <title> dynamically per page/route

import { useEffect } from 'react';

const APP_NAME = 'PennyPilot';

/**
 * Set the document title dynamically.
 * @param {string} pageTitle  e.g. "Dashboard" → sets "Dashboard | PennyPilot"
 */
export function usePageTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = APP_NAME;
    };
  }, [pageTitle]);
}
