import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import ToastProviderWrapper from '@/components/ToastProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Medi Track - Your Health, Refined',
  description: 'Luxury medical tracking and wellness analytics for modern healthcare',
  keywords: 'health tracking, medical records, wellness analytics, vital signs, AI health insights',
  authors: [{ name: 'Medi Track Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Medi Track - Your Health, Refined',
    description: 'Luxury medical tracking and wellness analytics for modern healthcare',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medi Track - Your Health, Refined',
    description: 'Luxury medical tracking and wellness analytics for modern healthcare',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={inter.className}>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        
        {/* Wellness Aura Background */}
        <div className="wellness-aura" aria-hidden="true" />
        
        {/* Global Toast Provider */}
        <ToastProviderWrapper>
          {/* Page Content with Navigation */}
          <AppLayoutWrapper>
            <div className="relative min-h-screen">
              {children}
            </div>
          </AppLayoutWrapper>
        </ToastProviderWrapper>
      </body>
    </html>
  );
}