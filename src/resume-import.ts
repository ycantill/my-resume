// Reads a resume JSON file for the edit-mode preview. It accepts the same shape
// the database holds: either a full export of the database (with the "public"
// and, optionally, "private" nodes) or just the contents of the "public" node.
import { normalizeResumeData } from './api-service.ts';
import { RESUME_SECTIONS, validateSection } from './resume-validation.ts';
import type { PersonalInfo, ResumeData } from './types.ts';

export class ResumeImportError extends Error {
  constructor(message: string, readonly details: string[] = []) {
    super(message);
    this.name = 'ResumeImportError';
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// The Firebase console exports a list whose keys have gaps as an object keyed
// by index ({"0": …, "2": …}); the app reads lists as arrays
function listsAsArrays(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(listsAsArrays);
  if (!isPlainObject(value)) return value;

  const keys = Object.keys(value);
  if (keys.length > 0 && keys.every(key => /^\d+$/.test(key))) {
    return keys
      .sort((a, b) => Number(a) - Number(b))
      .map(key => listsAsArrays(value[key]));
  }

  return Object.fromEntries(keys.map(key => [key, listsAsArrays(value[key])]));
}

function readContact(value: unknown): PersonalInfo | null {
  if (!isPlainObject(value)) return null;
  const locations: unknown[] = Array.isArray(value.locations)
    ? value.locations.filter(isPlainObject)
    : [];
  return {
    ...(value as object),
    email: typeof value.email === 'string' ? value.email : '',
    locations,
  } as PersonalInfo;
}

/**
 * Parses and checks a resume JSON file. Throws a ResumeImportError listing what
 * is wrong when the file does not match the structure the page renders.
 */
export function parseResumeJson(text: string): { data: ResumeData; contact: PersonalInfo | null } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (err) {
    throw new ResumeImportError('invalidJson', [err instanceof Error ? err.message : String(err)]);
  }

  raw = listsAsArrays(raw);
  if (!isPlainObject(raw)) {
    throw new ResumeImportError('invalidShape');
  }

  // A full export wraps the resume in "public"; the public node alone has "basics"
  const isFullExport = isPlainObject(raw.public);
  const publicNode = isFullExport ? raw.public : raw;
  if (!isPlainObject(publicNode) || !isPlainObject(publicNode.basics)) {
    throw new ResumeImportError('invalidShape');
  }

  // Normalizing first fills in the sections Firebase drops when they are empty,
  // exactly as happens when the same data is read from the database
  const data = normalizeResumeData(publicNode);
  const errors = RESUME_SECTIONS.flatMap(section => validateSection(section, data[section]));
  if (errors.length > 0) {
    throw new ResumeImportError('invalidData', errors);
  }

  return { data, contact: isFullExport ? readContact(raw.private) : null };
}
