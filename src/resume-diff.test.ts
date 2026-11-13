import { describe, expect, it } from 'vitest';
import { diffResume, diffWords, summarizeEntry } from './resume-diff';
import type { ResumeData } from './types';
import fixture from './test/fixtures/resume.json';

const base = fixture as ResumeData;
const clone = (): ResumeData => structuredClone(base);

describe('diffResume', () => {
  it('finds nothing when both versions are equal', () => {
    expect(diffResume(base, clone(), 'en')).toEqual([]);
  });

  it('reports a changed field in the basics', () => {
    const after = clone();
    after.basics.label.en = 'Staff Engineer';

    expect(diffResume(base, after, 'en')).toEqual([
      {
        section: 'basics',
        title: '',
        changes: [
          { kind: 'changed', field: ['label', 'en'], before: 'Frontend Engineer', after: 'Staff Engineer' },
        ],
      },
    ]);
  });

  it('reports one added bullet instead of every bullet shifting', () => {
    const after = clone();
    const acme = after.work[0] as { highlights: { en: string[] } };
    acme.highlights.en.unshift('Led the migration');

    const [group] = diffResume(base, after, 'en');
    expect(group).toMatchObject({ section: 'work', entry: 0, title: 'Acme' });
    expect(group.changes).toEqual([
      { kind: 'added', field: ['highlights', 'en'], after: 'Led the migration' },
    ]);
  });

  it('notices reordered keywords', () => {
    const after = clone();
    after.skills[0].keywords.reverse();

    const [group] = diffResume(base, after, 'en');
    expect(group.changes).toEqual([{ kind: 'reordered', field: ['keywords'] }]);
  });

  it('reports a whole removed entry once, summarized in the viewed language', () => {
    const after = clone();
    after.languages.pop();

    const [group] = diffResume(base, after, 'es');
    expect(group.section).toBe('languages');
    expect(group.title).toBe('Inglés');
    expect(group.changes).toEqual([
      { kind: 'removed', field: [], before: 'Inglés · Intermedio alto (B2)' },
    ]);
  });

  it('ignores a value that went from missing to empty', () => {
    const after = clone();
    (after.work[0] as { endDate?: string }).endDate = '';
    expect(diffResume(base, after, 'en')).toEqual([]);
  });
});

describe('summarizeEntry', () => {
  it('summarizes an entry in one line without its long text fields', () => {
    expect(summarizeEntry(base.education[0], 'en')).toBe(
      "Test University · Bachelor's Degree · Computer Science · Barranquilla, Colombia"
    );
  });
});

describe('diffWords', () => {
  it('marks the words that changed', () => {
    expect(diffWords('writes tests first', 'writes good tests first')).toEqual([
      { type: 'same', text: 'writes ' },
      { type: 'added', text: 'good ' },
      { type: 'same', text: 'tests first' },
    ]);
  });

  it('gives up on texts too long to compare cheaply', () => {
    const long = Array.from({ length: 700 }, (_, i) => `word${i}`).join(' ');
    expect(diffWords(long, `${long} more`)).toBeNull();
  });
});
