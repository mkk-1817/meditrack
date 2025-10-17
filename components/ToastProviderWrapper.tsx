'use client';

/**
 * Toast Provider Wrapper - Client Component
 * Provides global toast notification context to the entire app
 */

import { ReactNode } from 'react';
import { ToastProvider } from '@/contexts/ToastContext';

interface ToastProviderWrapperProps {
  children: ReactNode;
}

export default function ToastProviderWrapper({ children }: ToastProviderWrapperProps) {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      {children}
    </ToastProvider>
  );
}
