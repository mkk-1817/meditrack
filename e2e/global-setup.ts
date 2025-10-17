/**
 * Playwright Global Setup
 * Initializes test environment and authentication state
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright global setup...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Wait for the development server to be ready
  try {
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000');
    await page.waitForSelector('main', { timeout: 30000 });
    console.log('✅ Application is ready for testing');
  } catch (error) {
    console.error('❌ Failed to load application:', error);
    throw error;
  }
  
  // Set up authentication state if needed
  // This would typically involve logging in and saving the auth state
  // await page.goto('/login');
  // await page.fill('[data-testid=email]', 'test@example.com');
  // await page.fill('[data-testid=password]', 'password');
  // await page.click('[data-testid=login-button]');
  // await page.context().storageState({ path: 'playwright/.auth/user.json' });
  
  await browser.close();
  console.log('✅ Global setup completed');
}

export default globalSetup;