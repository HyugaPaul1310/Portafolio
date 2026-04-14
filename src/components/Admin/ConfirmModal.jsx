import React, { useEffect, useState } from 'react';
import { AlertCircle, HelpCircle, X } from 'lucide-react';
import './Admin.css';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'primary',
  showButtons = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`confirm-overlay ${isOpen ? 'active' : ''}`}>
      <div className={`confirm-container ${isOpen ? 'active' : ''}`}>
        <div className="confirm-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>

        {showButtons && (
          <div className="confirm-footer">
            <button 
              className={`confirm-btn-action ${type}`} 
              onClick={() => {
                onConfirm();
                onCancel();
              }}
            >
              {confirmText}
            </button>
            <button className="confirm-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
