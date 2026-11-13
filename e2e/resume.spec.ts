import { test, expect, resume, DATABASE_URL } from './fixtures';

test.describe('resume page', () => {
  test('renders the resume in English', async ({ page }) => {
    await page.goto('/#/en');

    await expect(page.getByRole('heading', { level: 1, name: resume.basics.name })).toBeVisible();
    await expect(page.getByText(resume.basics.summary.en)).toBeVisible();
    for (const section of ['Summary', 'Experience', 'Education', 'Languages']) {
      await expect(page.getByRole('heading', { name: section })).toBeVisible();
    }
    await expect(page.getByText('Acme')).toBeVisible();
    await expect(page).toHaveTitle(`${resume.basics.name} - Resume`);
  });

  test('renders the resume in Spanish', async ({ page }) => {
    await page.goto('/#/es');

    await expect(page.getByText(resume.basics.summary.es)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Experiencia' })).toBeVisible();
    await expect(page.getByText('Remoto · Colombia')).toBeVisible();
  });

  test('takes the country from the URL', async ({ page }) => {
    await page.goto('/#/en/spain');
    await expect(page.getByText('Remote · Spain')).toBeVisible();
  });

  test('never shows a phone number without a session', async ({ page }) => {
    await page.goto('/#/en/colombia');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  });

  test('keeps the top bar out of the printed page', async ({ page }) => {
    await page.goto('/#/en');
    const bar = page.getByRole('banner');
    await expect(bar).toBeVisible();

    await page.emulateMedia({ media: 'print' });
    await expect(bar).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('routing', () => {
  test('sends an unknown language to English', async ({ page }) => {
    await page.goto('/#/fr');
    await expect(page).toHaveURL(/#\/en$/);
  });

  test.describe('with a Spanish browser', () => {
    test.use({ locale: 'es-ES' });

    test('opens the root URL in the browser language', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/#\/es$/);
      await expect(page.getByRole('heading', { name: 'Resumen' })).toBeVisible();
    });
  });
});

test('explains when the database cannot be read', async ({ page }) => {
  await page.route(`${DATABASE_URL}/public.json`, route =>
    route.fulfill({ status: 500, body: 'boom' })
  );
  await page.goto('/#/en');

  await expect(page.getByText('Error loading resume')).toBeVisible();
});

test('loads without console errors or React warnings', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));

  await page.goto('/#/en/spain');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/#/es');
  await expect(page.getByRole('heading', { name: 'Resumen' })).toBeVisible();

  // Requests to Firebase Auth are blocked on purpose in these tests; their
  // network errors are expected and say nothing about the app
  const relevant = problems.filter(text => !/net::ERR_FAILED|Failed to load resource/.test(text));
  expect(relevant).toEqual([]);
});
