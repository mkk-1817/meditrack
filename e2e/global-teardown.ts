/**
 * Playwright Global Teardown
 * Cleans up test environment after all tests complete
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig) {
  console.log('🧹 Starting Playwright global teardown...');
  
  // Clean up any global resources
  // For example, stopping test databases, clearing temp files, etc.
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;