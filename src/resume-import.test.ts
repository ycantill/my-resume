import { describe, expect, it } from 'vitest';
import { parseResumeJson, ResumeImportError } from './resume-import';
import { normalizeResumeData } from './api-service';
import fixture from './test/fixtures/resume.json';

function importError(text: string): ResumeImportError {
  try {
    parseResumeJson(text);
  } catch (err) {
    if (err instanceof ResumeImportError) return err;
    throw err;
  }
  throw new Error('expected parseResumeJson to throw');
}

describe('parseResumeJson', () => {
  it('reads the public node on its own', () => {
    const { data, contact } = parseResumeJson(JSON.stringify(fixture));
    expect(data.basics.name).toBe('Ada Tester');
    expect(contact).toBeNull();
  });

  it('reads a full database export with its private node', () => {
    const exported = {
      public: fixture,
      private: { locations: [{ en: 'Spain', es: 'España', phone: '+34 600 000 000' }] },
    };
    const { data, contact } = parseResumeJson(JSON.stringify(exported));

    expect(data.work).toHaveLength(2);
    expect(contact?.locations[0].phone).toBe('+34 600 000 000');
    expect(contact?.email).toBe('');
  });

  it('turns lists exported as index-keyed objects back into arrays', () => {
    const withGaps = { ...fixture, skills: { '0': fixture.skills[0] } };
    const { data } = parseResumeJson(JSON.stringify(withGaps));
    expect(data.skills).toEqual(fixture.skills);
  });

  it('fills in sections Firebase drops when they are empty', () => {
    const { data } = parseResumeJson(JSON.stringify({ basics: fixture.basics }));
    expect(data.work).toEqual([]);
    expect(data.languages).toEqual([]);
  });

  it('rejects text that is not JSON', () => {
    expect(importError('{ nope').message).toBe('invalidJson');
  });

  it('rejects JSON without a resume in it', () => {
    expect(importError('[1, 2, 3]').message).toBe('invalidShape');
    expect(importError('{"public": {}}').message).toBe('invalidShape');
  });

  it('lists every structural problem it finds', () => {
    const broken = { ...fixture, basics: { ...fixture.basics, summary: 'plain text' } };
    const error = importError(JSON.stringify(broken));

    expect(error.message).toBe('invalidData');
    expect(error.details).toContain('basics.summary: expected an object with "en" and "es" text');
  });
});

describe('normalizeResumeData', () => {
  it('drops the null holes Firebase leaves in lists', () => {
    const data = normalizeResumeData({ ...fixture, education: [null, fixture.education[0]] });
    expect(data.education).toEqual(fixture.education);
  });

  it('gives a resume without profiles an empty list', () => {
    const { profiles, ...basics } = fixture.basics;
    expect(normalizeResumeData({ basics }).basics.profiles).toEqual([]);
  });
});
