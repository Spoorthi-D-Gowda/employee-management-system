import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const { type, message } = toast;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.9)', icon: CheckCircle2, border: '#10b981' };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.9)', icon: AlertCircle, border: '#ef4444' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.9)', icon: Info, border: '#3b82f6' };
    }
  };

  const { bg, icon: Icon, border } = getToastStyles();

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      background: bg,
      color: '#ffffff',
      backdropFilter: 'blur(12px)',
      padding: '12px 18px',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderLeft: `4px solid ${border}`,
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <Icon size={20} />
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', marginLeft: '8px' }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
