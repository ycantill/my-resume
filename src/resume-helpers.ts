// Helper functions for date formatting and durations used by the resume component
import type { WorkEntry, GroupedWorkEntry, BasicLocation, Language, DateRange } from './types.ts';

// Formats a YYYY-MM string into MMM YYYY localized label
export function formatDateLabel(ym: string | null | undefined, lang: Language): string | null {
  if (!ym || typeof ym !== 'string') return null;
  const [yStr, mStr] = ym.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  if (!y || !m) return null;
  const months = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  };
  const key = months[lang] ? lang : 'en';
  return `${months[key][m - 1]} ${y}`;
}

// Parses "YYYY-MM" to a Date at the first day of that month
export function parseYearMonth(ym: string | null | undefined): Date | null {
  if (!ym || typeof ym !== 'string') return null;
  const [y, m] = ym.split('-').map(v => parseInt(v, 10));
  if (!y || !m) return null;
  return new Date(y, m - 1, 1);
}

// Computes full months difference between two dates (ignores days)
export function monthsBetween(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0;
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  return months;
}

// Formats a months duration into a localized "X years Y months"
export function formatMonths(months: number, lang: Language): string {
  if (months <= 0) return lang === 'en' ? '<1 month' : '<1 mes';
  const years = Math.floor(months / 12);
  const rem = months % 12;

  const parts = [];
  if (years > 0) {
    if (lang === 'en') {
      parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    } else {
      parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
    }
  }
  if (rem > 0) {
    if (lang === 'en') {
      parts.push(`${rem} ${rem === 1 ? 'month' : 'months'}`);
    } else {
      parts.push(`${rem} ${rem === 1 ? 'mes' : 'meses'}`);
    }
  }
  return parts.join(' ');
}

// Builds the duration label for a job using startDate and endDate (or now)
export function formatDuration(job: DateRange, lang: Language): string {
  const start = parseYearMonth(job.startDate);
  const end = job.endDate ? parseYearMonth(job.endDate) : new Date();
  const months = monthsBetween(start, end);
  return formatMonths(months, lang);
}

// Returns a localized date range; if no endDate, shows Present/Actualidad
export function formatDateRange(job: DateRange, lang: Language): string {
  const start = formatDateLabel(job.startDate, lang) || job.startDate;
  const end = job.endDate
    ? formatDateLabel(job.endDate, lang) || job.endDate
    : (lang === 'en' ? 'Present' : 'Actualidad');
  return `${start} – ${end}`;
}

// Opens the browser print dialog
export function printResume(): void {
  window.print();
}

// Normalize phone to be used inside a tel: link
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';
  return String(phone).replace(/\s+/g, '');
}

// Build a single human-readable label for a location
export function formatLocationLabel(loc: BasicLocation | null | undefined, lang: Language): string {
  if (!loc) return '';
  const region = loc.region && typeof loc.region === 'object' ? (loc.region[lang] || loc.region.en || '') : (loc.region || '');
  const country = loc.country && typeof loc.country === 'object'
    ? (loc.country[lang] || loc.country.en || '')
    : (loc.country || countryNameFromCode(loc.countryCode, lang) || '');
  const city = loc.city || '';
  const segs = [city, region, country].filter(Boolean);
  if (segs.length) return segs.join(', ');
  return '';
}

// Map ISO country codes to localized names (fallback if country not provided)
export function countryNameFromCode(code: string | null | undefined, lang: Language): string {
  if (!code) return '';
  const map = {
    ES: { en: 'Spain', es: 'España' },
    CO: { en: 'Colombia', es: 'Colombia' },
  };
  const rec = map[code.toUpperCase() as keyof typeof map];
  if (!rec) return '';
  return lang === 'es' ? rec.es : rec.en;
}

// Group multiple work entries by company name; returns a list where
// companies with multiple entries become a single item with roles[]
export function groupWorkEntries(work: WorkEntry[] = []): GroupedWorkEntry[] {
  const order: string[] = [];
  const groups = new Map<string, { name: string; items: WorkEntry[] }>();
  for (const item of work) {
    const key = item && item.name ? item.name : '__unknown__';
    if (!groups.has(key)) {
      groups.set(key, { name: item.name, items: [] });
      order.push(key);
    }
    const g = groups.get(key)!;
    g.items.push(item);
  }

  const result: GroupedWorkEntry[] = [];
  for (const key of order) {
    const g = groups.get(key);
    if (!g || g.items.length === 0) continue;
    if (g.items.length === 1) {
      // Single item: keep as-is
      result.push(g.items[0]);
    } else {
      // Build roles array from items
      const roles = g.items.map(it => ({
        position: it.position,
        startDate: it.startDate,
        endDate: it.endDate,
        location: it.location,
        summary: it.summary,
        highlights: it.highlights,
        stack: it.stack,
      }));
      result.push({ name: g.items[0].name, roles });
    }
  }
  return result;
}