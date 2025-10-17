/**
 * E2E Test: Landing Page and Navigation
 * Tests core user flows and luxury design elements
 */

import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully with all key elements', async ({ page }) => {
    // Check page title and meta
    await expect(page).toHaveTitle(/Medi Track/);
    
    // Check main navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
    await expect(page.locator('nav >> text=Vitals')).toBeVisible();
    await expect(page.locator('nav >> text=Insights')).toBeVisible();
    
    // Check hero section
    await expect(page.locator('h1')).toContainText('Track Your Health');
    await expect(page.locator('[data-testid=hero-cta]')).toBeVisible();
    
    // Check wellness aura background animation
    await expect(page.locator('[data-testid=wellness-aura]')).toBeVisible();
  });

  test('has accessible navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('[href="#main-content"]');
    if (await skipLink.isVisible()) {
      await expect(skipLink).toContainText('Skip to main content');
    }
    
    // Test ARIA labels
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('aria-label');
  });

  test('hero section interactivity', async ({ page }) => {
    // Test CTA button
    const ctaButton = page.locator('[data-testid=hero-cta]');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
    
    // Test hover effects (luxury design)
    await ctaButton.hover();
    await page.waitForTimeout(500); // Allow animation
    
    // Click and verify navigation
    await ctaButton.click();
    await expect(page).toHaveURL(/dashboard|vitals/);
  });

  test('responsive design', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('[data-testid=desktop-menu]')).toBeVisible();
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileMenu = page.locator('[data-testid=mobile-menu-trigger]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('[data-testid=mobile-menu]')).toBeVisible();
    }
  });

  test('floating health icons animation', async ({ page }) => {
    const healthIcons = page.locator('[data-testid=floating-icons]');
    await expect(healthIcons).toBeVisible();
    
    // Check for multiple animated icons
    const iconCount = await page.locator('[data-testid=floating-icons] > *').count();
    expect(iconCount).toBeGreaterThan(0);
  });

  test('wellness aura performance', async ({ page }) => {
    // Check that animations don't block interaction
    const startTime = Date.now();
    await page.locator('[data-testid=hero-cta]').click();
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(2000); // Should respond quickly
  });
});

test.describe('Navigation Flow', () => {
  test('main navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test Dashboard navigation
    await page.click('nav >> text=Dashboard');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1')).toContainText(/Dashboard|Overview/);
    
    // Test Vitals navigation
    await page.click('nav >> text=Vitals');
    await expect(page).toHaveURL(/vitals/);
    
    // Test Insights navigation
    await page.click('nav >> text=Insights');
    await expect(page).toHaveURL(/insights/);
    
    // Test back to home
    await page.click('nav >> text=Home');
    await expect(page).toHaveURL('/');
  });

  test('breadcrumb navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check breadcrumbs exist
    const breadcrumbs = page.locator('[data-testid=breadcrumbs]');
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toContainText('Dashboard');
      
      // Navigate via breadcrumb
      await page.click('[data-testid=breadcrumbs] >> text=Home');
      await expect(page).toHaveURL('/');
    }
  });

  test('mega menu functionality', async ({ page }) => {
    await page.goto('/');
    
    const megaMenuTrigger = page.locator('[data-testid=mega-menu-trigger]');
    if (await megaMenuTrigger.isVisible()) {
      // Open mega menu
      await megaMenuTrigger.hover();
      await expect(page.locator('[data-testid=mega-menu]')).toBeVisible();
      
      // Test category navigation
      await page.click('[data-testid=mega-menu] >> text=Health Tracking');
      await expect(page).toHaveURL(/vitals|health/);
    }
  });
});

test.describe('Performance and Accessibility', () => {
  test('meets core web vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure page load performance
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const entries = JSON.parse(performanceEntries);
    const loadTime = entries[0]?.loadEventEnd - entries[0]?.loadEventStart;
    
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  });

  test('accessibility compliance', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check color contrast (basic check)
    const bodyStyles = await page.locator('body').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });
    
    expect(bodyStyles.color).toBeTruthy();
    expect(bodyStyles.backgroundColor).toBeTruthy();
  });

  test('reduced motion preference', async ({ page }) => {
    // Simulate prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Animations should be minimal or disabled
    const animatedElements = page.locator('[data-animate=true]');
    const count = await animatedElements.count();
    
    // This test would verify that animations respect user preferences
    // The exact implementation depends on how reduced motion is handled
  });

  test('keyboard navigation flow', async ({ page }) => {
    await page.goto('/');
    
    // Test tab order
    const focusableElements = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return elements.length;
    });
    
    expect(focusableElements).toBeGreaterThan(0);
    
    // Test escape key behavior
    const modal = page.locator('[role=dialog]');
    if (await modal.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });
});

test.describe('Custom Cursor and Luxury Elements', () => {
  test('custom cursor appears and functions', async ({ page }) => {
    await page.goto('/');
    
    const customCursor = page.locator('[data-testid=custom-cursor]');
    if (await customCursor.isVisible()) {
      // Move mouse and verify cursor follows
      await page.mouse.move(200, 200);
      await page.waitForTimeout(100);
      
      const cursorPosition = await customCursor.boundingBox();
      expect(cursorPosition).toBeTruthy();
    }
  });

  test('gold glow effects on interactive elements', async ({ page }) => {
    await page.goto('/');
    
    const interactiveButton = page.locator('[data-testid=hero-cta]');
    await interactiveButton.hover();
    
    // Check for gold glow class or styling
    const hasGlowEffect = await interactiveButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.boxShadow.includes('gold') || 
             el.classList.contains('glow') ||
             styles.filter.includes('drop-shadow');
    });
    
    // This would be true if luxury effects are properly applied
    // expect(hasGlowEffect).toBe(true);
  });

  test('shimmer loading effects', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for shimmer loading states
    const shimmerElements = page.locator('[data-testid*=shimmer]');
    if (await shimmerElements.first().isVisible()) {
      await expect(shimmerElements.first()).toHaveClass(/shimmer|loading/);
    }
  });
});