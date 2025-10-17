'use client';

/**
 * HCI Menu Components
 * Implements various menu types from HCI principles
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

// ============================================
// CONTEXTUAL MENU (Right-Click Menu)
// ============================================

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  onClose: () => void;
  position: { x: number; y: number };
}

export function ContextMenu({ items, onClose, position }: ContextMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('contextmenu', onClose);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('contextmenu', onClose);
    };
  }, [onClose]);

  if (!mounted) return null;

  const renderMenu = (menuItems: ContextMenuItem[], level = 0) => (
    <motion.div
      ref={level === 0 ? menuRef : null}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-[200px] z-[100]"
      style={level === 0 ? { position: 'fixed', left: position.x, top: position.y } : {}}
    >
      {menuItems.map((item) => (
        <div key={item.id}>
          {item.divider ? (
            <div className="h-px bg-gray-200 my-1" />
          ) : (
            <div className="relative">
              <motion.button
                whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
                onClick={() => {
                  if (!item.disabled && !item.submenu) {
                    item.action();
                    onClose();
                  }
                }}
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.id)}
                onMouseLeave={() => item.submenu && setTimeout(() => setActiveSubmenu(null), 300)}
                disabled={item.disabled}
                className={`w-full px-4 py-2 text-left flex items-center justify-between space-x-3 transition-colors ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span className="font-body text-sm">{item.label}</span>
                </div>
                {item.submenu && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </motion.button>
              
              {/* Cascading Submenu */}
              {item.submenu && activeSubmenu === item.id && (
                <div className="absolute left-full top-0 ml-1">
                  {renderMenu(item.submenu, level + 1)}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>
      {renderMenu(items)}
    </AnimatePresence>,
    document.body
  );
}

// ============================================
// PIE / RADIAL MENU
// ============================================

export interface PieMenuItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  color?: string;
}

interface PieMenuProps {
  items: PieMenuItem[];
  onClose: () => void;
  center: { x: number; y: number };
}

export function PieMenu({ items, onClose, center }: PieMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const radius = 80;

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = () => onClose();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 100);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!mounted) return null;

  const angleStep = (2 * Math.PI) / items.length;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      {/* Center Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative"
        style={{
          position: 'fixed',
          left: center.x,
          top: center.y,
          pointerEvents: 'auto'
        }}
      >
        {/* Center Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onClose}
          className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full shadow-luxury flex items-center justify-center text-white text-2xl"
        >
          ✕
        </motion.button>

        {/* Pie Menu Items */}
        {items.map((item, index) => {
          const angle = angleStep * index - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.button
              key={item.id}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ scale: 1, x, y }}
              exit={{ scale: 0, x: 0, y: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                item.action();
                onClose();
              }}
              className={`absolute w-14 h-14 rounded-full shadow-luxury flex items-center justify-center text-2xl transition-all ${
                item.color || 'bg-white'
              }`}
              style={{
                transform: `translate(-50%, -50%)`,
              }}
            >
              {item.icon}
              
              {/* Label on Hover */}
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white px-3 py-1 rounded-lg text-xs font-body whitespace-nowrap"
                >
                  {item.label}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ============================================
// DROPDOWN MENU (Pull-Down Menu)
// ============================================

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: ContextMenuItem[];
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, items, align = 'left' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-[200px] z-50 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {items.map((item) => (
              <div key={item.id}>
                {item.divider ? (
                  <div className="h-px bg-gray-200 my-1" />
                ) : (
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
                    onClick={() => {
                      if (!item.disabled) {
                        item.action();
                        setIsOpen(false);
                      }
                    }}
                    disabled={item.disabled}
                    className={`w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors ${
                      item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : item.danger
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-navy-700 hover:text-navy-900'
                    }`}
                  >
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <span className="font-body text-sm">{item.label}</span>
                  </motion.button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MEGA MENU
// ============================================

interface MegaMenuSection {
  title: string;
  items: {
    label: string;
    icon: string;
    href: string;
    description: string;
  }[];
}

interface MegaMenuProps {
  sections: MegaMenuSection[];
  trigger: React.ReactNode;
}

export function MegaMenu({ sections, trigger }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 w-[90vw] max-w-6xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-sm font-heading font-bold text-navy-900 mb-4 uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <motion.a
                        key={itemIndex}
                        href={item.href}
                        whileHover={{ x: 5 }}
                        onClick={() => setIsOpen(false)}
                        className="block p-3 rounded-lg hover:bg-teal-50 transition-colors group"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-body font-semibold text-navy-900 group-hover:text-teal-600 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-xs text-navy-600 mt-1">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// POPUP MENU (Icon Menu)
// ============================================

interface PopupMenuProps {
  trigger: React.ReactNode;
  items: Array<{
    icon: string;
    label: string;
    action: () => void;
  }>;
}

export function PopupMenu({ trigger, items }: PopupMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 z-50"
          >
            <div className="grid grid-cols-3 gap-2">
              {items.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs font-body text-navy-700">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
