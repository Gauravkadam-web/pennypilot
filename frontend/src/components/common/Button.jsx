// frontend/src/components/common/Button.jsx
import { Loader2 } from 'lucide-react';

/**
 * @param {'primary'|'secondary'|'ghost'|'destructive'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  id,
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      id={id}
      type={type}
      className={`btn btn--${variant} btn--${size} ${isDisabled ? 'btn--disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
    >
      {loading && <Loader2 size={14} className="spinner-icon" style={{ animation: 'spin 0.6s linear infinite' }} />}
      {children}
    </button>
  );
}
