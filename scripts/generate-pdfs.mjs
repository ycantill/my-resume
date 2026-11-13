// Prints every language/location version of the resume to PDF and writes them,
// with a manifest, to dist/pdfs so they are deployed next to the site.
//
// Run after `npm run build:github`, with VITE_DATABASE_URL set:
//   npm run pdfs
//
// The pages are printed without a session, so the private node (phone
// numbers) is never loaded and never ends up in a public PDF.

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const LANGUAGES = ['en', 'es'];
// Keep in sync with ROUTE_LOCATIONS in src/resume-helpers.ts
const LOCATIONS = ['colombia', 'spain'];

const OUT_DIR = join('dist', 'pdfs');

const databaseUrl = (process.env.VITE_DATABASE_URL ?? '').replace(/\/$/, '');
if (!databaseUrl) {
  console.error('VITE_DATABASE_URL is not set');
  process.exit(1);
}

// Fingerprint of the data the PDFs are printed from. The deploy workflow
// compares it with the live database to know when they are stale. Taken
// before printing, so a change made mid-run shows up as stale next time.
const publicResponse = await fetch(`${databaseUrl}/public.json`);
if (!publicResponse.ok) {
  console.error(`Could not read /public: HTTP ${publicResponse.status}`);
  process.exit(1);
}
const publicBody = await publicResponse.text();
const dataHash = createHash('sha256').update(publicBody).digest('hex');
const name = JSON.parse(publicBody)?.basics?.name ?? 'resume';

const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

await mkdir(OUT_DIR, { recursive: true });

const server = await preview({ preview: { port: 4173, strictPort: true, open: false } });
const baseUrl = server.resolvedUrls.local[0];

const browser = await chromium.launch({
  // Lets a machine with its own Chromium skip `playwright install`
  executablePath: process.env.PDF_CHROMIUM_PATH || undefined,
});

const files = [];

try {
  for (const language of LANGUAGES) {
    for (const location of LOCATIONS) {
      const file = `${slug(name)}-cv-${language}-${location}.pdf`;
      // A fresh page per route: on a reused one, a goto that only changes the
      // hash returns at once and could print the previous route
      const page = await browser.newPage();
      await page.goto(`${baseUrl}#/${language}/${location}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('.resume-container', { timeout: 30_000 });
      await page.evaluate(() => document.fonts.ready);

      await page.pdf({
        path: join(OUT_DIR, file),
        // Use the @page size and margins from the print stylesheet
        preferCSSPageSize: true,
        printBackground: true,
      });
      await page.close();

      files.push({ language, location, file });
      console.log(`Printed ${file}`);
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}

const manifest = {
  name,
  generatedAt: new Date().toISOString(),
  dataHash,
  // The branch this deploy came from, so pdf-refresh.yml redeploys the same one
  ref: process.env.GITHUB_REF_NAME ?? null,
  files,
};

await writeFile(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Wrote ${files.length} PDFs to ${OUT_DIR}`);
