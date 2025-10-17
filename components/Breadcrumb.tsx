'use client';

/**
 * Breadcrumb Navigation Component
 * Shows current page hierarchy for better navigation context
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: string;
}

const pageLabels: Record<string, { label: string; icon: string }> = {
  '/dashboard': { label: 'Dashboard', icon: '📊' },
  '/vitals': { label: 'Vitals', icon: '❤️' },
  '/insights': { label: 'AI Insights', icon: '🧠' },
  '/appointments': { label: 'Appointments', icon: '📅' },
  '/profile': { label: 'Profile', icon: '👤' },
  '/emergency': { label: 'Emergency', icon: '🚨' },
  '/settings': { label: 'Settings', icon: '⚙️' },
  '/records': { label: 'Medical Records', icon: '📋' },
  '/medications': { label: 'Medications', icon: '💊' },
  '/symptoms': { label: 'Symptoms', icon: '🩺' }
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // Don't show breadcrumb on home or landing pages
  if (!pathname || pathname === '/' || pathname === '/landing') {
    return null;
  }

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard', icon: '🏠' }
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const pageInfo = pageLabels[currentPath];
      if (pageInfo) {
        breadcrumbs.push({
          label: pageInfo.label,
          href: currentPath,
          icon: pageInfo.icon
        });
      } else {
        // Capitalize and format unknown paths
        const label = path
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({
          label,
          href: currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 max-w-7xl mx-auto">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center space-x-2">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-1 text-sm font-body font-semibold text-navy-900"
                  aria-current="page"
                >
                  {crumb.icon && <span>{crumb.icon}</span>}
                  <span>{crumb.label}</span>
                </motion.span>
              ) : (
                <Link href={crumb.href}>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-1 text-sm font-body text-navy-600 hover:text-teal-600 transition-colors cursor-pointer"
                  >
                    {crumb.icon && <span>{crumb.icon}</span>}
                    <span>{crumb.label}</span>
                  </motion.span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
