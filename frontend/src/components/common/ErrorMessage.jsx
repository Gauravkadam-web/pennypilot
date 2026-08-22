// frontend/src/components/common/ErrorMessage.jsx
import { AlertCircle } from 'lucide-react';
import Button from './Button.jsx';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={32} color="var(--color-negative)" aria-hidden="true" />
      <p className="error-state__title">Something went wrong</p>
      <p className="error-state__body">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} id="error-retry-btn">
          Try again
        </Button>
      )}
    </div>
  );
}
