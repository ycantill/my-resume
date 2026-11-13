import { test as base, expect } from '@playwright/test';
import resume from '../src/test/fixtures/resume.json' with { type: 'json' };

export const DATABASE_URL = 'https://resume-fixture.test';

// Every test gets a page whose database is the fixture resume, and where any
// other outside request (Firebase Auth, Google APIs) is blocked
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url.startsWith('http://localhost')) return route.continue();
      if (url.startsWith(`${DATABASE_URL}/public.json`)) {
        return route.fulfill({ json: resume });
      }
      return route.abort();
    });
    await use(page);
  },
});

export { expect, resume };
