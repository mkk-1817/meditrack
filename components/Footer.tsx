'use client';

/**
 * Footer Component - Compact 50px Footer Menu
 * Minimal footer with essential links and copyright
 */

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Listen for sidebar width changes from localStorage or custom events
    const handleStorageChange = () => {
      const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
      setSidebarWidth(collapsed ? 80 : 280);
    };

    // Check for dark mode
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkMobile();
    handleStorageChange();
    checkDarkMode();
    
    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    window.addEventListener('resize', checkMobile);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sidebar-toggle', handleStorageChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebar-toggle', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  return (
    <footer 
      className={`fixed bottom-0 right-0 h-[50px] border-t z-40 backdrop-blur-md transition-all duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-r from-navy-900 via-navy-800 to-teal-900 border-white/20'
      }`}
      style={{
        left: isMobile ? '0' : `${sidebarWidth}px`
      }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left: Copyright */}
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏥</span>
            <p className={`font-body text-xs sm:text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-400'
            }`}>
              © {currentYear} MediTrack
            </p>
          </div>

          {/* Center: Quick Links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`font-body text-sm transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/vitals"
              className={`font-body text-sm transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Vitals
            </Link>
            <Link
              href="/emergency"
              className={`font-body text-sm font-semibold transition-colors ${
                isDarkMode 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-red-400 hover:text-red-300'
              }`}
            >
              🚨 Emergency
            </Link>
            <Link
              href="/settings"
              className={`font-body text-sm transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Settings
            </Link>
          </div>

          {/* Right: Version & Legal */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/privacy"
              className={`font-body text-xs sm:text-sm transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Privacy
            </Link>
            <span className={`hidden sm:inline transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>•</span>
            <span className={`font-body text-xs hidden sm:inline transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
