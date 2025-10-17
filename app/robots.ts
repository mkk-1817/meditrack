import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration for search engine crawling
 * This file is automatically served at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://meditrack.vercel.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/dashboard',
          '/vitals',
          '/insights', 
          '/health/*',
          '/articles',
          '/articles/*',
          '/help',
          '/privacy',
          '/terms'
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/profile',
          '/settings',
          '/auth/*',
          '/_next/*',
          '/temp/*',
          '*.json',
          '*.xml'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/dashboard',
          '/vitals',
          '/insights',
          '/health/*',
          '/articles',
          '/articles/*'
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/profile',
          '/settings',
          '/auth/*'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/dashboard', 
          '/vitals',
          '/insights',
          '/health/*',
          '/articles',
          '/articles/*'
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/profile',
          '/settings',
          '/auth/*'
        ],
      },
      // Block scrapers and unwanted bots
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot'
        ],
        disallow: ['/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}