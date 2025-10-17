'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MegaMenu } from '@/components/HCIMenus';

/**
 * Header Component with HCI Mega Menu
 * Provides navigation with accessibility features and responsive design
 * Now using the HCI MegaMenu component for enhanced UX
 * Includes logout functionality
 */

// Mega Menu Sections for HCI Component
const megaMenuSections = [
  {
    title: 'Health Tracking',
    items: [
      { label: 'Dashboard', icon: '📊', href: '/dashboard', description: 'Overview of your health metrics' },
      { label: 'Vitals', icon: '❤️', href: '/vitals', description: 'Track blood pressure, heart rate, and more' },
      { label: 'Symptoms', icon: '🩺', href: '/symptoms', description: 'Log and monitor symptoms' },
      { label: 'Profile', icon: '👤', href: '/profile', description: 'Manage your personal information' },
    ],
  },
  {
    title: 'AI Insights & Analysis',
    items: [
      { label: 'Health Insights', icon: '🧠', href: '/insights', description: 'AI-powered health recommendations' },
      { label: 'Risk Assessment', icon: '⚠️', href: '/risk', description: 'Identify potential health risks' },
      { label: 'Trends', icon: '📈', href: '/trends', description: 'Long-term health trend analysis' },
      { label: 'Reports', icon: '�', href: '/reports', description: 'Generate health reports' },
    ],
  },
  {
    title: 'Records & Care',
    items: [
      { label: 'Medical Records', icon: '📋', href: '/records', description: 'Store and manage medical documents' },
      { label: 'Appointments', icon: '📅', href: '/appointments', description: 'Schedule and manage appointments' },
      { label: 'Medications', icon: '💊', href: '/medications', description: 'Track medications and reminders' },
      { label: 'Emergency', icon: '�', href: '/emergency', description: 'Emergency contacts and medical ID' },
    ],
  },
];

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Get user email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('meditrack-user-email');
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    // Clear all login-related data
    localStorage.removeItem('meditrack-logged-in');
    localStorage.removeItem('meditrack-user-email');
    localStorage.removeItem('meditrack-login-time');
    localStorage.removeItem('meditrack-remember-me');
    
    // Redirect to login page
    router.push('/login');
  };

  // Handle escape key and click outside for mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 ${className}`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="/"
                className="flex items-center space-x-3 text-xl font-heading font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                aria-label="Medi Track - Home"
              >
                <div className="w-8 h-8 bg-gradient-luxury rounded-lg flex items-center justify-center text-white">
                  🏥
                </div>
                <span className="hidden sm:block">Medi Track</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" role="navigation">
              <a
                href="/dashboard"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                Dashboard
              </a>
              
              {/* HCI Mega Menu Component */}
              <MegaMenu
                sections={megaMenuSections}
                trigger={
                  <button
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 flex items-center space-x-1"
                    aria-haspopup="true"
                    aria-label="Open main menu"
                  >
                    <span>Health Tools</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                }
              />

              <a
                href="/insights"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                AI Insights
              </a>
              
              <a
                href="/appointments"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                Appointments
              </a>

              <a
                href="/emergency"
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                <span>🚨</span>
                <span>Emergency</span>
              </a>

              <a
                href="/settings"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                Settings
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                className="hidden sm:flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                aria-label="Add new vital reading"
              >
                <span>+</span>
                <span className="hidden md:block">Add Vital</span>
              </button>

              {/* User Menu with Logout */}
              {userEmail && (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-luxury border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm text-gray-500 font-body">Signed in as</p>
                        <p className="text-sm font-semibold text-navy-900 font-body truncate">{userEmail}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <a
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-lg">👤</span>
                          <span className="text-sm font-body text-gray-700">Your Profile</span>
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-lg">⚙️</span>
                          <span className="text-sm font-body text-gray-700">Settings</span>
                        </a>
                        <a
                          href="/hci-demo"
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-lg">🎨</span>
                          <span className="text-sm font-body text-gray-700">HCI Demo</span>
                        </a>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 w-full hover:bg-red-50 transition-colors text-left"
                        >
                          <span className="text-lg">🚪</span>
                          <span className="text-sm font-body text-red-600 font-semibold">Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuToggle}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-200"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200" role="menu">
            <div className="px-4 py-6 space-y-4">
              {/* User Info for Mobile */}
              {userEmail && (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-body">Signed in as</p>
                      <p className="text-sm font-semibold text-navy-900 font-body truncate">{userEmail}</p>
                    </div>
                  </div>
                </div>
              )}

              <a
                href="/dashboard"
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                role="menuitem"
              >
                Dashboard
              </a>
              <a
                href="/vitals"
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                role="menuitem"
              >
                Vitals
              </a>
              <a
                href="/insights"
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                role="menuitem"
              >
                AI Insights
              </a>
              <a
                href="/records"
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                role="menuitem"
              >
                Medical Records
              </a>
              <a
                href="/appointments"
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                role="menuitem"
              >
                Appointments
              </a>
              <a
                href="/emergency"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium py-2"
                role="menuitem"
              >
                <span>🚨</span>
                <span>Emergency</span>
              </a>
              <a
                href="/settings"
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                role="menuitem"
              >
                Settings
              </a>

              {/* Logout Button for Mobile */}
              {userEmail && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium py-2 w-full"
                    role="menuitem"
                  >
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;