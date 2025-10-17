'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MessageWindow, ToastMessage } from '@/components/HCIWindows';

interface ToastContextType {
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  removeToast: (id: string) => void;
  toasts: ToastMessage[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export function ToastProvider({ children, position = 'top-right', maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = {
      id,
      title,
      message,
      type,
      duration
    };

    setToasts(prev => {
      // Limit number of toasts
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts);
    });
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
      <MessageWindow
        messages={toasts}
        onDismiss={removeToast}
        position={position}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Convenience hooks for specific toast types
export function useSuccessToast() {
  const { showToast } = useToast();
  return useCallback((title: string, message: string, duration?: number) => {
    showToast(title, message, 'success', duration);
  }, [showToast]);
}

export function useErrorToast() {
  const { showToast } = useToast();
  return useCallback((title: string, message: string, duration?: number) => {
    showToast(title, message, 'error', duration);
  }, [showToast]);
}

export function useWarningToast() {
  const { showToast } = useToast();
  return useCallback((title: string, message: string, duration?: number) => {
    showToast(title, message, 'warning', duration);
  }, [showToast]);
}

export function useInfoToast() {
  const { showToast } = useToast();
  return useCallback((title: string, message: string, duration?: number) => {
    showToast(title, message, 'info', duration);
  }, [showToast]);
}
