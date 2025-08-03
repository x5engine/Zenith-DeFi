import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const ToastContext = createContext();

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
`;

const Toast = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'success': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'error': return 'linear-gradient(135deg, #dc2626, #b91c1c)';
      case 'warning': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'info': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  }};
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 300px;
  animation: ${props => props.isRemoving ? slideOut : slideIn} 0.3s ease forwards;
`;

const ToastIcon = styled.div`
  flex-shrink: 0;
  font-size: 20px;
  margin-top: 2px;
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`;

const ToastMessage = styled.div`
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ToastComponent = ({ toast, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getTitle = (type) => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      default: return 'Notification';
    }
  };

  return (
    <Toast type={toast.type} isRemoving={toast.isRemoving}>
      <ToastIcon>{getIcon(toast.type)}</ToastIcon>
      <ToastContent>
        <ToastTitle>{toast.title || getTitle(toast.type)}</ToastTitle>
        <ToastMessage>{toast.message}</ToastMessage>
      </ToastContent>
      <ToastClose onClick={() => onClose(toast.id)}>×</ToastClose>
    </Toast>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isRemoving: true } : toast
      )
    );

    // Actually remove after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };

    // Add toast and schedule removal in a single state update
    setToasts(prev => {
      const updated = [...prev, newToast];
      
      // Schedule removal only if duration > 0
      if (newToast.duration > 0) {
        setTimeout(() => {
          setToasts(current => 
            current.map(t => 
              t.id === id ? { ...t, isRemoving: true } : t
            )
          );
          setTimeout(() => {
            setToasts(current => current.filter(t => t.id !== id));
          }, 300);
        }, newToast.duration);
      }
      
      return updated;
    });

    return id;
  }, []); // NO DEPENDENCIES - prevents re-creation

  const toast = useMemo(() => ({
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, duration: 7000, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    custom: (options) => addToast(options),
    remove: removeToast,
    clear: () => setToasts([])
  }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer>
        {toasts.map(toastItem => (
          <ToastComponent 
            key={toastItem.id} 
            toast={toastItem} 
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};