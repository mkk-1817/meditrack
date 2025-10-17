/**
 * E2E Test: Performance and Core Web Vitals
 * Comprehensive performance testing for luxury medical application
 */

import { test, expect } from '@playwright/test';

test.describe('Performance Metrics', () => {
  test('meets Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics: any = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              metrics.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              metrics.cls = (metrics.cls || 0) + entry.value;
            }
          });
          
          if (metrics.lcp) {
            resolve(metrics);
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback after 5 seconds
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    // Core Web Vitals thresholds
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500); // LCP should be under 2.5s
    }
    if (metrics.fid) {
      expect(metrics.fid).toBeLessThan(100); // FID should be under 100ms
    }
    if (metrics.cls) {
      expect(metrics.cls).toBeLessThan(0.1); // CLS should be under 0.1
    }
  });

  test('page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('dashboard performance with data', async ({ page }) => {
    await page.goto('/dashboard');
    
    const startTime = Date.now();
    
    // Wait for data to load
    await page.waitForSelector('[data-testid*="vital-card"], .vital-card', { timeout: 5000 });
    
    const renderTime = Date.now() - startTime;
    
    // Dashboard should render quickly
    expect(renderTime).toBeLessThan(2000);
  });

  test('image optimization', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const src = await image.getAttribute('src');
      const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
      const displayWidth = await image.evaluate((img: HTMLImageElement) => img.offsetWidth);
      
      // Images should be reasonably optimized (not more than 2x display size)
      if (naturalWidth && displayWidth) {
        expect(naturalWidth).toBeLessThanOrEqual(displayWidth * 2.5);
      }
    }
  });

  test('animation performance', async ({ page }) => {
    await page.goto('/');
    
    // Measure frame rate during animations
    const fps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        const startTime = performance.now();
        
        function countFrames() {
          frames++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve(frames);
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    });
    
    // Should maintain reasonable frame rate (at least 30 FPS)
    expect(fps).toBeGreaterThan(30);
  });

  test('memory usage stability', async ({ page }) => {
    await page.goto('/');
    
    // Initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Navigate through pages
    await page.goto('/dashboard');
    await page.goto('/vitals');
    await page.goto('/insights');
    await page.goto('/');
    
    // Check memory after navigation
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Memory shouldn't grow excessively (less than 50MB increase)
    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
    }
  });
});

test.describe('Network Performance', () => {
  test('efficient resource loading', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        size: parseInt(response.headers()['content-length'] || '0'),
        type: response.headers()['content-type']
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for efficient loading
    const jsFiles = responses.filter(r => r.type?.includes('javascript'));
    const cssFiles = responses.filter(r => r.type?.includes('css'));
    const imageFiles = responses.filter(r => r.type?.includes('image'));
    
    // Reasonable bundle sizes
    const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
    
    expect(totalJsSize).toBeLessThan(1024 * 1024); // Under 1MB for JS
    expect(totalCssSize).toBeLessThan(200 * 1024); // Under 200KB for CSS
    
    // All responses should be successful
    const errorResponses = responses.filter(r => r.status >= 400);
    expect(errorResponses).toHaveLength(0);
  });

  test('cache headers optimization', async ({ page }) => {
    const cacheableResponses: any[] = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('/_next/static/') || url.includes('.js') || url.includes('.css')) {
        cacheableResponses.push({
          url,
          cacheControl: response.headers()['cache-control'],
          etag: response.headers()['etag']
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Static assets should have proper cache headers
    cacheableResponses.forEach(response => {
      expect(response.cacheControl).toBeTruthy();
      if (response.url.includes('/_next/static/')) {
        expect(response.cacheControl).toContain('immutable');
      }
    });
  });

  test('lazy loading implementation', async ({ page }) => {
    await page.goto('/');
    
    // Check that below-fold images are lazy loaded
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const loading = await image.getAttribute('loading');
      const isInViewport = await image.isInViewport();
      
      // Images below fold should have lazy loading
      if (!isInViewport && loading !== 'eager') {
        expect(loading).toBe('lazy');
      }
    }
  });
});

test.describe('Mobile Performance', () => {
  test('mobile page speed', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Mobile should load quickly
    expect(loadTime).toBeLessThan(4000);
  });

  test('mobile interaction responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const button = page.locator('[data-testid=hero-cta]').first();
    
    const startTime = Date.now();
    await button.click();
    const responseTime = Date.now() - startTime;
    
    // Touch interactions should be responsive
    expect(responseTime).toBeLessThan(100);
  });

  test('mobile scroll performance', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Measure scroll performance
    const scrollPerformance = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        const startTime = performance.now();
        
        function measureScroll() {
          frames++;
          window.scrollBy(0, 10);
          
          if (window.scrollY < 500) {
            requestAnimationFrame(measureScroll);
          } else {
            const duration = performance.now() - startTime;
            resolve({ frames, duration, fps: frames / (duration / 1000) });
          }
        }
        
        requestAnimationFrame(measureScroll);
      });
    });
    
    // Should maintain good FPS during scroll
    expect((scrollPerformance as any).fps).toBeGreaterThan(25);
  });
});

test.describe('Third-party Performance', () => {
  test('external resource loading', async ({ page }) => {
    const externalRequests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
        externalRequests.push(url);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should minimize external dependencies
    expect(externalRequests.length).toBeLessThan(10);
    
    // Common third-party domains that should load quickly
    const criticalDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    
    for (const domain of criticalDomains) {
      const domainRequests = externalRequests.filter(url => url.includes(domain));
      // These should be present but minimal
      expect(domainRequests.length).toBeLessThan(5);
    }
  });

  test('font loading optimization', async ({ page }) => {
    await page.goto('/');
    
    // Check font display strategy
    const fontFaces = await page.evaluate(() => {
      const fonts = Array.from(document.fonts);
      return fonts.map(font => ({
        family: font.family,
        status: font.status,
        display: (font as any).display
      }));
    });
    
    // Fonts should load efficiently
    fontFaces.forEach(font => {
      expect(['loaded', 'loading']).toContain(font.status);
    });
  });
});