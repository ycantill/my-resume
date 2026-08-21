// Helper functions for date formatting and durations used by the resume component
import type {
  WorkEntry,
  WorkItem,
  WorkGroupEntry,
  WorkPath,
  WorkRole,
  GroupedWorkEntry,
  LocationInfo,
  Language,
  DateRange,
  LocalizedText,
  LocalizedHighlights,
  ContactProfile,
  Education,
  LanguageEntry,
  Skill,
} from './types.ts';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

// Translations object
const translations = {
  en: enTranslations,
  es: esTranslations,
} as const;

// Unified translation helper - handles both Firebase LocalizedText and static strings
export function t(textOrKey: LocalizedText | string, lang: Language): string {
  // If it's a LocalizedText object (has 'en' property)
  if (typeof textOrKey === 'object' && textOrKey !== null && 'en' in textOrKey) {
    return textOrKey[lang] || textOrKey.en || '';
  }
  
  // If it's a string key, look it up in translations
  if (typeof textOrKey === 'string') {
    const keys = textOrKey.split('.');
    let value: any = translations[lang];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return textOrKey; // Return key if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : textOrKey;
  }
  
  return '';
}

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

// Normalize phone to be used inside a tel: link
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';
  return String(phone).replace(/\s+/g, '');
}

// Turns a location's English name into a URL-safe slug, e.g. "Spain" -> "spain"
export function slugifyLocationName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Resolves the location matching a URL slug (derived from its "en" name),
// falling back to the first location when the slug is missing or unknown
export function findLocationBySlug(
  locations: LocationInfo[] | null | undefined,
  slug: string | null | undefined
): LocationInfo | null {
  if (!locations || locations.length === 0) return null;
  if (slug) {
    const match = locations.find(loc => slugifyLocationName(loc.en) === slug.toLowerCase());
    if (match) return match;
  }
  return locations[0];
}

// True when an entry stores its roles nested instead of being one flat role
export function isWorkGroup(item: WorkItem): item is WorkGroupEntry {
  return Array.isArray((item as WorkGroupEntry).roles);
}

// Lifts a flat entry into a role, used when two entries share a company name
function toRole(entry: GroupedWorkEntry): WorkRole {
  const empty: LocalizedText = { en: '', es: '' };
  return {
    sourcePath: entry.sourcePath,
    position: entry.position ?? empty,
    startDate: entry.startDate ?? '',
    endDate: entry.endDate,
    location: entry.location ?? empty,
    summary: entry.summary ?? empty,
    highlights: entry.highlights ?? { en: [], es: [] },
    stack: entry.stack,
  };
}

// Normalizes the work list for display. The database holds two shapes: a flat
// entry per role, and a company with its roles nested. Both come out as one
// list of companies, and every role carries the path it has to be written back
// to — the inline editor addresses the stored data, not this view of it.
export function groupWorkEntries(work: WorkItem[] = []): GroupedWorkEntry[] {
  const result: GroupedWorkEntry[] = [];
  const positionByName = new Map<string, number>();

  work.forEach((item, index) => {
    if (!item) return;
    const path: WorkPath = { entry: index };

    // Already grouped in the database
    if (isWorkGroup(item)) {
      result.push({
        name: item.name,
        sourcePath: path,
        sourcePaths: [path],
        roles: (item.roles ?? []).map((role, roleIndex) => ({
          ...role,
          sourcePath: { entry: index, role: roleIndex },
        })),
      });
      return;
    }

    const seenAt = item.name ? positionByName.get(item.name) : undefined;

    if (seenAt === undefined) {
      if (item.name) positionByName.set(item.name, result.length);
      result.push({ ...item, sourcePath: path, sourcePaths: [path] });
      return;
    }

    // A second flat entry for a company already listed: fold both into roles
    const existing = result[seenAt];
    const roles = existing.roles ?? [toRole(existing)];
    result[seenAt] = {
      name: existing.name,
      sourcePaths: [...(existing.sourcePaths ?? []), path],
      roles: [...roles, toRole({ ...item, sourcePath: path })],
    };
  });

  return result;
}

// Builds the localized value for the language being edited, leaving the other
// language untouched — you edit the resume in the language you are reading it in
export function withLocalized(
  current: LocalizedText | undefined,
  language: Language,
  value: string
): LocalizedText {
  return { en: '', es: '', ...current, [language]: value };
}

export function withLocalizedList(
  current: LocalizedHighlights | undefined,
  language: Language,
  value: string[]
): LocalizedHighlights {
  return { en: [], es: [], ...current, [language]: value };
}

// The current month in the "YYYY-MM" shape the resume stores dates in
export function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Splits a profile URL into the network/username fields stored alongside it,
// so adding a link by pasting its URL still produces a complete profile
export function profileFromUrl(url: string): ContactProfile {
  let network = '';
  let username = '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    network = parsed.hostname.replace(/^www\./, '').split('.')[0];
    username = parsed.pathname.split('/').filter(Boolean).pop() ?? '';
  } catch {
    // A half-typed URL is fine; the fields fill in once it parses
  }
  return { network, url, username };
}

// Blank entries used by the "add" controls in edit mode
export function createWorkEntry(): WorkEntry {
  return {
    name: '',
    position: { en: '', es: '' },
    startDate: currentYearMonth(),
    location: { en: '', es: '' },
    summary: { en: '', es: '' },
    highlights: { en: [], es: [] },
    stack: [],
  };
}

export function createEducationEntry(): Education {
  return {
    institution: '',
    studyType: { en: '', es: '' },
    area: { en: '', es: '' },
    location: '',
  };
}

export function createLanguageEntry(): LanguageEntry {
  return {
    language: { en: '', es: '' },
    fluency: { en: '', es: '' },
  };
}

export function createSkillEntry(): Skill {
  return {
    name: '',
    keywords: [],
  };
}