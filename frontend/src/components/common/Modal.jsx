// frontend/src/components/common/Modal.jsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, footer, id }) {
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    // Focus first focusable element
    const t = setTimeout(() => firstFocusRef.current?.focus(), 50);
    // Trap focus inside modal
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', handleKey); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" id={id}>
        <div className="modal__header">
          <h2 className="modal__title" id={`${id}-title`}>{title}</h2>
          <button
            className="btn btn--ghost btn--sm"
            onClick={onClose}
            aria-label="Close modal"
            ref={firstFocusRef}
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
