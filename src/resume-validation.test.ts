import { describe, expect, it } from 'vitest';
import { RESUME_SECTIONS, validateSection } from './resume-validation';
import fixture from './test/fixtures/resume.json';

describe('validateSection', () => {
  it('accepts every section of a well-formed resume', () => {
    for (const section of RESUME_SECTIONS) {
      expect(validateSection(section, fixture[section])).toEqual([]);
    }
  });

  it('tolerates blank text, as a freshly added entry has', () => {
    const blank = [{ name: '', keywords: [] }];
    expect(validateSection('skills', blank)).toEqual([]);
  });

  it('reports a localized value missing a language', () => {
    const basics = { ...fixture.basics, label: { en: 'Engineer' } };
    expect(validateSection('basics', basics)).toEqual(['basics.label.es: expected a string']);
  });

  it('reports dates that are not YYYY-MM', () => {
    const work = [{ ...fixture.work[0], startDate: '03/2024' }];
    expect(validateSection('work', work)).toEqual([
      'work[0].startDate: expected a "YYYY-MM" date, e.g. "2024-03"',
    ]);
  });

  it('allows a cleared date but not an impossible month', () => {
    expect(validateSection('work', [{ ...fixture.work[0], endDate: '' }])).toEqual([]);
    expect(validateSection('work', [{ ...fixture.work[0], endDate: '2024-13' }])).toHaveLength(1);
  });

  it('validates roles nested inside a company', () => {
    const globex = fixture.work[1] as { name: string; roles: Record<string, unknown>[] };
    const broken = { ...globex, roles: [{ ...globex.roles[0], highlights: { en: 'one', es: [] } }] };
    expect(validateSection('work', [broken])).toEqual([
      'work[0].roles[0].highlights.en: expected an array of strings',
    ]);
  });

  it('rejects a list section that is not a list', () => {
    expect(validateSection('languages', {})).toEqual(['languages: expected an array']);
  });
});
