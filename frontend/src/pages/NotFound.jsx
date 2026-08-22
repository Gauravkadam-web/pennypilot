// frontend/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <Compass size={48} className="empty-state__icon" aria-hidden="true" />
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)' }}>404 — Page not found</h1>
      <p className="empty-state__body">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        id="go-home-link"
        className="btn btn--primary btn--md"
        style={{ marginTop: 'var(--space-2)' }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
