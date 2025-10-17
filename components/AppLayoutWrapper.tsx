'use client';

/**
 * App Layout Wrapper - Client Component
 * Wraps all pages with Navigation component and Footer
 */

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Pages where we don't want to show navigation and footer
  const noNavPages = ['/', '/landing', '/login', '/register'];
  const showNav = !noNavPages.includes(pathname);

  return (
    <>
      {showNav && <Navigation />}
      {showNav && <FloatingActionButton />}
      <div className={showNav ? 'page-content' : ''}>
        {showNav && <Breadcrumb />}
        {children}
      </div>
      {showNav && <Footer />}
    </>
  );
}
