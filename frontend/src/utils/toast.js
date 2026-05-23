import toast from 'react-hot-toast';

// Centralized styles for premium SaaS toasts
export const showToast = {
  success: (message) => {
    toast.success(message, {
      style: {
        border: '1px solid rgba(59, 130, 246, 0.15)',
        padding: '12px 18px',
        color: '#0F172A',
        background: '#FFFFFF',
        fontSize: '13px',
        fontWeight: '600',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.08), 0 8px 10px -6px rgba(59, 130, 246, 0.08)',
      },
      iconTheme: {
        primary: '#3B82F6',
        secondary: '#FFFFFF',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      style: {
        border: '1px solid rgba(239, 68, 68, 0.15)',
        padding: '12px 18px',
        color: '#0F172A',
        background: '#FFFFFF',
        fontSize: '13px',
        fontWeight: '600',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.08), 0 8px 10px -6px rgba(239, 68, 68, 0.08)',
      },
      iconTheme: {
        primary: '#EF4444',
        secondary: '#FFFFFF',
      },
    });
  },

  warning: (message) => {
    toast(message, {
      icon: '⚠️',
      style: {
        border: '1px solid rgba(245, 158, 11, 0.15)',
        padding: '12px 18px',
        color: '#0F172A',
        background: '#FFFFFF',
        fontSize: '13px',
        fontWeight: '600',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.08), 0 8px 10px -6px rgba(245, 158, 11, 0.08)',
      },
    });
  },

  info: (message) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        border: '1px solid #1E293B',
        padding: '12px 18px',
        color: '#E5E7EB',
        background: '#0F172A',
        fontSize: '13px',
        fontWeight: '600',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
      },
    });
  }
};
