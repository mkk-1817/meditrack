'use client';

/**
 * Navigation Component - Easy Page Switching
 * Sidebar navigation for desktop, bottom navigation for mobile
 */

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  color: string;
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'vitals',
    label: 'Vitals',
    href: '/vitals',
    icon: '❤️',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'insights',
    label: 'Insights',
    href: '/insights',
    icon: '🧠',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'appointments',
    label: 'Appointments',
    href: '/appointments',
    icon: '📅',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: '👤',
    color: 'from-teal-500 to-green-600'
  },
  {
    id: 'emergency',
    label: 'Emergency',
    href: '/emergency',
    icon: '🚨',
    color: 'from-red-600 to-orange-600'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: '⚙️',
    color: 'from-gray-500 to-gray-600'
  }
];

export default function Navigation() {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true');
    }

    // Check for dark mode
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkMobile();
    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  // Save sidebar state and dispatch event when it changes
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
    window.dispatchEvent(new Event('sidebar-toggle'));
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: isSidebarCollapsed ? '80px' : '280px' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`fixed left-0 top-0 h-screen backdrop-blur-sm border-r shadow-luxury z-50 flex flex-col transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-900/95 border-gray-700' 
              : 'bg-white/95 border-gray-200'
          }`}
        >
          {/* Logo & Toggle */}
          <div className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                    🏥
                  </div>
                  <div>
                    <h1 className={`text-lg font-heading font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-navy-900'
                    }`}>MediTrack</h1>
                    <p className={`text-xs font-body transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-navy-500'
                    }`}>Health Companion</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className={`w-5 h-5 transition-all duration-300 ${
                  isSidebarCollapsed ? 'rotate-180' : ''
                } ${isDarkMode ? 'text-gray-300' : 'text-navy-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <div className="space-y-1">
              {navigationItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.id} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                        active
                          ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-navy-700 hover:bg-gray-100'
                      }`}
                    >
                      {/* Active Indicator */}
                      {/* {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0  -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )} */}

                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0">{item.icon}</div>

                      {/* Label */}
                      <AnimatePresence mode="wait">
                        {!isSidebarCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1 overflow-hidden"
                          >
                            <span className={`font-body font-medium whitespace-nowrap ${
                              active 
                                ? 'text-white' 
                                : isDarkMode 
                                  ? 'text-gray-300 group-hover:text-white' 
                                  : 'text-navy-700 group-hover:text-navy-900'
                            }`}>
                              {item.label}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      {item.badge && !isSidebarCollapsed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-2 py-0.5 bg-red-500 text-white text-xs font-body font-bold rounded-full"
                        >
                          {item.badge}
                        </motion.div>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isSidebarCollapsed && (
                        <div className={`absolute left-full ml-2 px-3 py-2 text-sm font-body rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl ${
                          isDarkMode 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-navy-900 text-white'
                        }`}>
                          {item.label}
                          <div className={`absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent ${
                            isDarkMode ? 'border-r-gray-800' : 'border-r-navy-900'
                          }`} />
                        </div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-xl border transition-colors duration-300 ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-gold-900/30 to-teal-900/30 border-gold-700/30'
                      : 'bg-gradient-to-br from-gold-50 to-teal-50 border-gold-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-xl">💡</div>
                    <span className={`text-xs font-body font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-navy-900'
                    }`}>Quick Tip</span>
                  </div>
                  <p className={`text-xs font-body leading-relaxed transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-navy-600'
                  }`}>
                    Track your vitals daily for better health insights!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <div className="text-2xl">💡</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className={`fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t shadow-luxury z-50 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-900/95 border-gray-700' 
              : 'bg-white/95 border-gray-200'
          }`}
        >
          <div className="flex items-center justify-around px-2 py-3">
            {navigationItems.slice(0, 5).map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.id} href={item.href} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center space-y-1 cursor-pointer"
                  >
                    <div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-br ' + item.color + ' shadow-lg scale-110'
                          : isDarkMode
                            ? 'bg-gray-800'
                            : 'bg-gray-100'
                      }`}
                    >
                      <span className={`text-xl ${active ? '' : 'grayscale'}`}>
                        {item.icon}
                      </span>
                      {item.badge && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.badge}
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-xs font-body font-medium transition-colors duration-200 ${
                        active 
                          ? isDarkMode ? 'text-white' : 'text-navy-900'
                          : isDarkMode ? 'text-gray-400' : 'text-navy-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
            {/* More Menu */}
            <Link href="/settings" className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center space-y-1 cursor-pointer"
              >
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                    isActive('/settings') || isActive('/emergency')
                      ? 'bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg scale-110'
                      : isDarkMode
                        ? 'bg-gray-800'
                        : 'bg-gray-100'
                  }`}
                >
                  <span className={`text-xl ${isActive('/settings') || isActive('/emergency') ? '' : 'grayscale'}`}>
                    ⋯
                  </span>
                </div>
                <span
                  className={`text-xs font-body font-medium transition-colors duration-200 ${
                    isActive('/settings') || isActive('/emergency') 
                      ? isDarkMode ? 'text-white' : 'text-navy-900'
                      : isDarkMode ? 'text-gray-400' : 'text-navy-500'
                  }`}
                >
                  More
                </span>
              </motion.div>
            </Link>
          </div>
        </motion.nav>
      )}

      {/* Spacer for content */}
      <style jsx global>{`
        .page-content {
          margin-left: ${isMobile ? '0' : isSidebarCollapsed ? '80px' : '280px'};
          margin-bottom: ${isMobile ? '80px' : '50px'};
          padding-bottom: ${isMobile ? '0' : '0'};
          transition: margin-left 0.3s ease-in-out;
          min-height: calc(100vh - 50px);
        }
      `}</style>
    </>
  );
}
