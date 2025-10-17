'use client';

/**
 * HCI Window Components
 * Implements various window types from HCI principles
 */

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { createPortal } from 'react-dom';

// ============================================
// DIALOG BOX (Modal Dialog)
// ============================================

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'default' | 'success' | 'warning' | 'error';
}

export function Dialog({ isOpen, onClose, title, children, actions, size = 'md', type = 'default' }: DialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const typeColors = {
    default: 'from-teal-500 to-teal-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-orange-600',
    error: 'from-red-500 to-red-600'
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[201] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl overflow-hidden`}
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${typeColors[type]} px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-heading font-bold text-white">
                      {title}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  {children}
                </div>

                {/* Actions */}
                {actions && (
                  <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
                    {actions}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ============================================
// FLOATING WINDOW (Palette Window)
// ============================================

interface FloatingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
}

export function FloatingWindow({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  initialPosition = { x: 100, y: 100 },
  width = 300,
  height = 400
}: FloatingWindowProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width,
        minHeight: height,
        zIndex: 150
      }}
      className="bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden"
      onDragEnd={(_event, info: PanInfo) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y
        });
      }}
    >
      {/* Title Bar (Draggable) */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 cursor-move flex items-center justify-between border-b border-gray-300">
        <h3 className="text-sm font-heading font-semibold text-navy-900">
          {title}
        </h3>
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-xs"
          >
            ✕
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: height - 60 }}>
        {children}
      </div>
    </motion.div>,
    document.body
  );
}

// ============================================
// TABBED WINDOW
// ============================================

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: ReactNode;
  badge?: number;
}

interface TabbedWindowProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function TabbedWindow({ tabs, defaultTab, onChange }: TabbedWindowProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="bg-white rounded-xl shadow-luxury border border-gray-200 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex items-center border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange(tab.id)}
            className={`relative px-6 py-3 font-body font-medium transition-colors flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'text-teal-600 bg-white'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            {tab.icon && <span className="text-lg">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {tab.badge}
              </span>
            )}
            
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-600"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {activeTabContent?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SPLIT WINDOW
// ============================================

interface SplitWindowProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultSplit?: number; // 0-100 percentage
  minSize?: number;
  orientation?: 'horizontal' | 'vertical';
}

export function SplitWindow({ 
  leftPanel, 
  rightPanel, 
  defaultSplit = 50, 
  minSize = 20,
  orientation = 'vertical'
}: SplitWindowProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      let newSplit;
      
      if (orientation === 'vertical') {
        newSplit = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        newSplit = ((e.clientY - rect.top) / rect.height) * 100;
      }
      
      setSplit(Math.max(minSize, Math.min(100 - minSize, newSplit)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, orientation, minSize]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-white rounded-xl shadow-luxury border border-gray-200 overflow-hidden ${
        orientation === 'vertical' ? 'flex' : 'flex flex-col'
      } h-full`}
    >
      {/* Left/Top Panel */}
      <div
        className="overflow-auto"
        style={{
          [orientation === 'vertical' ? 'width' : 'height']: `${split}%`
        }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={handleMouseDown}
        className={`relative flex items-center justify-center bg-gray-200 hover:bg-teal-500 transition-colors cursor-${
          orientation === 'vertical' ? 'col-resize' : 'row-resize'
        } group ${isDragging ? 'bg-teal-500' : ''}`}
        style={{
          [orientation === 'vertical' ? 'width' : 'height']: '6px'
        }}
      >
        <div className={`bg-gray-400 group-hover:bg-white transition-colors ${
          orientation === 'vertical' ? 'w-1 h-8' : 'w-8 h-1'
        } rounded-full ${isDragging ? 'bg-white' : ''}`} />
      </div>

      {/* Right/Bottom Panel */}
      <div
        className="overflow-auto"
        style={{
          [orientation === 'vertical' ? 'width' : 'height']: `${100 - split}%`
        }}
      >
        {rightPanel}
      </div>
    </div>
  );
}

// ============================================
// MESSAGE WINDOW (Toast/Notification)
// ============================================

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface MessageWindowProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function MessageWindow({ messages, onDismiss, position = 'top-right' }: MessageWindowProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    messages.forEach(message => {
      if (message.duration) {
        const timer = setTimeout(() => {
          onDismiss(message.id);
        }, message.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [messages, onDismiss]);

  if (!mounted) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  const typeStyles = {
    success: { bg: 'from-green-500 to-green-600', icon: '✓' },
    error: { bg: 'from-red-500 to-red-600', icon: '✕' },
    warning: { bg: 'from-yellow-500 to-orange-600', icon: '⚠' },
    info: { bg: 'from-blue-500 to-blue-600', icon: 'ℹ' }
  };

  return createPortal(
    <div className={`fixed ${positionClasses[position]} z-[300] space-y-3 max-w-md`}>
      <AnimatePresence>
        {messages.map((message) => {
          const style = typeStyles[message.type];
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="flex">
                {/* Icon Bar */}
                <div className={`w-16 bg-gradient-to-b ${style.bg} flex items-center justify-center text-white text-2xl`}>
                  {style.icon}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-navy-900 mb-1">
                        {message.title}
                      </h4>
                      <p className="text-sm text-navy-600 font-body">
                        {message.message}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDismiss(message.id)}
                      className="ml-3 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body
  );
}

// ============================================
// POPUP WINDOW (Secondary Window)
// ============================================

interface PopupWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
  height?: number;
}

export function PopupWindow({ isOpen, onClose, title, children, width = 600, height = 400 }: PopupWindowProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]"
      />

      {/* Popup Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ width, height }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-300 overflow-hidden z-[151] flex flex-col"
      >
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold text-white">
            {title}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </motion.div>
    </>,
    document.body
  );
}
