'use client';

/**
 * Floating Action Button (FAB) Component
 * Quick access to common actions from any page
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'add-vital',
    label: 'Add Vital',
    href: '/vitals?action=add',
    icon: '❤️',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'emergency',
    label: 'Emergency',
    href: '/emergency',
    icon: '🚨',
    color: 'from-red-600 to-orange-600'
  },
  {
    id: 'appointment',
    label: 'Book Appointment',
    href: '/appointments?action=add',
    icon: '📅',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'insights',
    label: 'AI Insights',
    href: '/insights',
    icon: '🧠',
    color: 'from-purple-500 to-indigo-600'
  }
];

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 md:bottom-16 md:right-4 z-40">
      {/* Quick Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 flex flex-col space-y-3"
          >
            {quickActions.map((action, index) => (
              <Link key={action.id} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 bg-white rounded-full shadow-luxury hover:shadow-luxury-hover transition-all duration-200 cursor-pointer pr-4 group"
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center text-xl shadow-lg`}
                  >
                    {action.icon}
                  </div>
                  <span className="text-sm font-body font-medium text-navy-900 whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: isOpen ? 45 : 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex items-center justify-center text-white text-2xl ${
          isOpen ? 'rotate-45' : ''
        }`}
        aria-label="Quick actions menu"
      >
        {isOpen ? '✕' : '+'}
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
