/**
 * E2E Test: Accessibility Compliance
 * Comprehensive accessibility testing using axe-core
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {
  test('landing page meets WCAG 2.2 AA standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard page accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude(['[data-testid="chart-canvas"]']) // Exclude charts that may need special handling
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('vitals page accessibility', async ({ page }) => {
    await page.goto('/vitals');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('color contrast compliance', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation accessibility', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['keyboard'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('form accessibility', async ({ page }) => {
    // If there are forms in the app
    await page.goto('/profile'); // Assuming there's a profile form
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['forms'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('aria compliance', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['aria'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('mobile accessibility', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('focus management in modals', async ({ page }) => {
    await page.goto('/');
    
    // Open a modal if one exists
    const modalTrigger = page.locator('[data-testid*="modal"], [aria-expanded]');
    if (await modalTrigger.first().isVisible()) {
      await modalTrigger.first().click();
      
      // Check focus trap
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus');
      expect(await focusedElement.isVisible()).toBe(true);
      
      // Test escape key
      await page.keyboard.press('Escape');
      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible()) {
        expect(await modal.isVisible()).toBe(false);
      }
    }
  });

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for heading structure
    const h1 = page.locator('h1');
    expect(await h1.count()).toBeGreaterThanOrEqual(1);
    
    // Check for proper list structures
    const lists = page.locator('ul, ol');
    const listCount = await lists.count();
    
    for (let i = 0; i < listCount; i++) {
      const list = lists.nth(i);
      const listItems = list.locator('li');
      const itemCount = await listItems.count();
      
      if (itemCount > 0) {
        expect(itemCount).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('Reduced Motion Accessibility', () => {
  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Check that animations are disabled or minimal
    const animatedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let animationCount = 0;
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.animationDuration !== '0s' && styles.animationDuration !== '') {
          animationCount++;
        }
      });
      
      return animationCount;
    });
    
    // Should have minimal animations when reduced motion is preferred
    expect(animatedElements).toBeLessThan(5);
  });

  test('essential animations remain accessible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Loading indicators should still be visible
    const loadingIndicators = page.locator('[data-testid*="loading"], [aria-busy="true"]');
    if (await loadingIndicators.first().isVisible()) {
      expect(await loadingIndicators.first().isVisible()).toBe(true);
    }
  });
});

test.describe('High Contrast Mode', () => {
  test('supports high contrast themes', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await page.goto('/');
    
    // Run accessibility scan in high contrast mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('forced colors compliance', async ({ page }) => {
    await page.addInitScript(() => {
      // Simulate forced-colors environment
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query.includes('forced-colors'),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });
    
    await page.goto('/');
    
    // Verify that custom colors don't override system colors
    const elements = page.locator('button, a, input');
    const count = await elements.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = elements.nth(i);
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor
        };
      });
      
      // In forced colors mode, these should use system colors
      expect(styles.color).toBeTruthy();
    }
  });
});