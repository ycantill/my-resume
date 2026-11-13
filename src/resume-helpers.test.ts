import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  t,
  formatDateLabel,
  parseYearMonth,
  monthsBetween,
  formatMonths,
  formatDuration,
  formatDateRange,
  normalizePhone,
  slugifyLocationName,
  findLocationBySlug,
  resolveRouteLocation,
  groupWorkEntries,
  withLocalized,
  withLocalizedList,
  profileFromUrl,
  isWorkGroup,
} from './resume-helpers';
import type { LocationInfo, WorkItem } from './types';
import fixture from './test/fixtures/resume.json';

describe('t', () => {
  it('picks the requested language from a localized value', () => {
    expect(t({ en: 'Hello', es: 'Hola' }, 'es')).toBe('Hola');
  });

  it('falls back to English when the requested language is empty', () => {
    expect(t({ en: 'Hello', es: '' }, 'es')).toBe('Hello');
  });

  it('looks up static keys in the locale files', () => {
    expect(t('sections.summary', 'en')).toBe('Summary');
    expect(t('sections.summary', 'es')).toBe('Resumen');
  });

  it('returns the key itself when it does not exist', () => {
    expect(t('sections.doesNotExist', 'es')).toBe('sections.doesNotExist');
  });
});

describe('dates', () => {
  afterEach(() => vi.useRealTimers());

  it('formats YYYY-MM as a localized month label', () => {
    expect(formatDateLabel('2024-03', 'en')).toBe('Mar 2024');
    expect(formatDateLabel('2024-01', 'es')).toBe('Ene 2024');
  });

  it('rejects malformed dates', () => {
    expect(formatDateLabel('', 'en')).toBeNull();
    expect(formatDateLabel('2024', 'en')).toBeNull();
    expect(parseYearMonth('not-a-date')).toBeNull();
  });

  it('counts whole months and never goes negative', () => {
    expect(monthsBetween(new Date(2020, 0, 1), new Date(2021, 3, 1))).toBe(15);
    expect(monthsBetween(new Date(2021, 0, 1), new Date(2020, 0, 1))).toBe(0);
    expect(monthsBetween(null, new Date())).toBe(0);
  });

  it('formats durations with singular and plural forms', () => {
    expect(formatMonths(0, 'en')).toBe('<1 month');
    expect(formatMonths(13, 'en')).toBe('1 year 1 month');
    expect(formatMonths(26, 'es')).toBe('2 años 2 meses');
  });

  it('measures an open-ended role up to today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 15));
    expect(formatDuration({ startDate: '2026-02' }, 'en')).toBe('9 months');
  });

  it('labels an open-ended range as present', () => {
    expect(formatDateRange({ startDate: '2024-02' }, 'en')).toBe('Feb 2024 – Present');
    expect(formatDateRange({ startDate: '2024-02' }, 'es')).toBe('Feb 2024 – Actualidad');
    expect(formatDateRange({ startDate: '2021-01', endDate: '2024-01' }, 'en')).toBe(
      'Jan 2021 – Jan 2024'
    );
  });
});

describe('locations and phones', () => {
  const locations: LocationInfo[] = [
    { en: 'Spain', es: 'España', phone: '+34 600 000 000' },
    { en: 'Colombia', es: 'Colombia', phone: '+57 300 000 0000' },
  ];

  it('strips spaces from a phone for tel: links', () => {
    expect(normalizePhone('+57 300 000 0000')).toBe('+573000000000');
    expect(normalizePhone(undefined)).toBe('');
  });

  it('slugifies names without accents or punctuation', () => {
    expect(slugifyLocationName('Bogotá, D.C.')).toBe('bogota-d-c');
    expect(slugifyLocationName('  United Kingdom ')).toBe('united-kingdom');
  });

  it('finds the location named by the URL slug', () => {
    expect(findLocationBySlug(locations, 'colombia')?.phone).toBe('+57 300 000 0000');
    expect(findLocationBySlug(locations, 'SPAIN')?.en).toBe('Spain');
  });

  it('falls back to the first location for a missing or unknown slug', () => {
    expect(findLocationBySlug(locations, null)?.en).toBe('Spain');
    expect(findLocationBySlug(locations, 'mars')?.en).toBe('Spain');
    expect(findLocationBySlug([], 'spain')).toBeNull();
  });

  it('names known route locations without private data', () => {
    expect(resolveRouteLocation(null, 'spain')).toEqual({ en: 'Spain', es: 'España' });
    expect(resolveRouteLocation(undefined, undefined)).toEqual({ en: 'Colombia', es: 'Colombia' });
  });

  it('title-cases an unknown slug', () => {
    expect(resolveRouteLocation(null, 'costa-rica')).toEqual({ en: 'Costa Rica', es: 'Costa Rica' });
  });

  it('prefers the private locations when they are loaded', () => {
    expect(resolveRouteLocation(locations, 'colombia')?.phone).toBe('+57 300 000 0000');
  });
});

describe('groupWorkEntries', () => {
  it('keeps flat and nested entries, tagging each with its source path', () => {
    const grouped = groupWorkEntries(fixture.work as WorkItem[]);

    expect(grouped.map(entry => entry.name)).toEqual(['Acme', 'Globex']);
    expect(grouped[0].sourcePath).toEqual({ entry: 0 });
    expect(grouped[1].roles?.map(role => role.sourcePath)).toEqual([
      { entry: 1, role: 0 },
      { entry: 1, role: 1 },
    ]);
  });

  it('folds two flat entries for the same company into roles', () => {
    const [acme] = fixture.work as WorkItem[];
    const grouped = groupWorkEntries([acme, { ...acme, startDate: '2020-01' } as WorkItem]);

    expect(grouped).toHaveLength(1);
    expect(grouped[0].roles).toHaveLength(2);
    expect(grouped[0].sourcePaths).toEqual([{ entry: 0 }, { entry: 1 }]);
  });

  it('skips empty slots left by the database', () => {
    expect(groupWorkEntries([null as unknown as WorkItem])).toEqual([]);
  });

  it('tells nested entries apart from flat ones', () => {
    const [acme, globex] = fixture.work as WorkItem[];
    expect(isWorkGroup(acme)).toBe(false);
    expect(isWorkGroup(globex)).toBe(true);
  });
});

describe('editing helpers', () => {
  it('only touches the language being edited', () => {
    expect(withLocalized({ en: 'Old', es: 'Viejo' }, 'es', 'Nuevo')).toEqual({
      en: 'Old',
      es: 'Nuevo',
    });
    expect(withLocalizedList(undefined, 'en', ['One'])).toEqual({ en: ['One'], es: [] });
  });

  it('derives network and username from a profile URL', () => {
    expect(profileFromUrl('https://www.linkedin.com/in/ada-tester')).toEqual({
      network: 'linkedin',
      url: 'https://www.linkedin.com/in/ada-tester',
      username: 'ada-tester',
    });
    expect(profileFromUrl('github.com/ada')).toMatchObject({ network: 'github', username: 'ada' });
  });
});
