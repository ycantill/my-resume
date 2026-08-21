// Shape guard for the resume sections before they are written to Firebase.
// The inline editor builds values field by field, so this checks structure only
// (a string is a string, a localized value has both languages) and deliberately
// tolerates empty text: a freshly added entry is blank until it is filled in.
import type { ResumeData } from './types.ts';

export type ResumeSectionKey = keyof ResumeData;

export const RESUME_SECTIONS: readonly ResumeSectionKey[] = [
  'basics',
  'work',
  'education',
  'languages',
  'skills',
] as const;

type Errors = string[];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checkString(value: unknown, path: string, errors: Errors, required = true): void {
  if (value === undefined && !required) return;
  if (typeof value !== 'string') {
    errors.push(`${path}: expected a string`);
  }
}

function checkLocalizedText(value: unknown, path: string, errors: Errors, required = true): void {
  if (value === undefined && !required) return;
  if (!isPlainObject(value)) {
    errors.push(`${path}: expected an object with "en" and "es" text`);
    return;
  }
  checkString(value.en, `${path}.en`, errors);
  checkString(value.es, `${path}.es`, errors);
}

function checkStringArray(value: unknown, path: string, errors: Errors, required = true): void {
  if (value === undefined && !required) return;
  if (!Array.isArray(value)) {
    errors.push(`${path}: expected an array of strings`);
    return;
  }
  value.forEach((item, index) => checkString(item, `${path}[${index}]`, errors));
}

function checkLocalizedHighlights(value: unknown, path: string, errors: Errors, required = true): void {
  if (value === undefined && !required) return;
  if (!isPlainObject(value)) {
    errors.push(`${path}: expected an object with "en" and "es" arrays`);
    return;
  }
  checkStringArray(value.en, `${path}.en`, errors);
  checkStringArray(value.es, `${path}.es`, errors);
}

// Dates are stored as "YYYY-MM" — formatDateLabel silently drops anything else.
// An empty string is allowed: it is what a cleared date input produces.
function checkYearMonth(value: unknown, path: string, errors: Errors, required = true): void {
  if (value === undefined && !required) return;
  if (typeof value !== 'string' || (value !== '' && !/^\d{4}-(0[1-9]|1[0-2])$/.test(value))) {
    errors.push(`${path}: expected a "YYYY-MM" date, e.g. "2024-03"`);
  }
}

function checkArraySection(value: unknown, path: string, errors: Errors): value is unknown[] {
  if (!Array.isArray(value)) {
    errors.push(`${path}: expected an array`);
    return false;
  }
  return true;
}

function validateBasics(value: unknown, errors: Errors): void {
  if (!isPlainObject(value)) {
    errors.push('basics: expected an object');
    return;
  }
  checkString(value.name, 'basics.name', errors);
  checkLocalizedText(value.label, 'basics.label', errors);
  checkString(value.email, 'basics.email', errors, false);
  checkLocalizedText(value.summary, 'basics.summary', errors);

  if (value.profiles !== undefined && checkArraySection(value.profiles, 'basics.profiles', errors)) {
    value.profiles.forEach((profile, index) => {
      const path = `basics.profiles[${index}]`;
      if (!isPlainObject(profile)) {
        errors.push(`${path}: expected an object`);
        return;
      }
      checkString(profile.network, `${path}.network`, errors);
      checkString(profile.url, `${path}.url`, errors);
      checkString(profile.username, `${path}.username`, errors);
    });
  }
}

function validateRole(role: unknown, path: string, errors: Errors): void {
  if (!isPlainObject(role)) {
    errors.push(`${path}: expected an object`);
    return;
  }
  checkLocalizedText(role.position, `${path}.position`, errors);
  checkYearMonth(role.startDate, `${path}.startDate`, errors);
  // A missing endDate is what marks the current role
  checkYearMonth(role.endDate, `${path}.endDate`, errors, false);
  checkLocalizedText(role.location, `${path}.location`, errors);
  checkLocalizedText(role.summary, `${path}.summary`, errors);
  checkLocalizedHighlights(role.highlights, `${path}.highlights`, errors);
  checkStringArray(role.stack, `${path}.stack`, errors, false);
}

function validateWork(value: unknown, errors: Errors): void {
  if (!checkArraySection(value, 'work', errors)) return;
  value.forEach((entry, index) => {
    const path = `work[${index}]`;
    if (!isPlainObject(entry)) {
      errors.push(`${path}: expected an object`);
      return;
    }
    checkString(entry.name, `${path}.name`, errors);

    // A company may store several roles nested instead of being one flat role
    if (Array.isArray(entry.roles)) {
      entry.roles.forEach((role, roleIndex) =>
        validateRole(role, `${path}.roles[${roleIndex}]`, errors)
      );
      return;
    }

    validateRole(entry, path, errors);
  });
}

function validateEducation(value: unknown, errors: Errors): void {
  if (!checkArraySection(value, 'education', errors)) return;
  value.forEach((entry, index) => {
    const path = `education[${index}]`;
    if (!isPlainObject(entry)) {
      errors.push(`${path}: expected an object`);
      return;
    }
    checkString(entry.institution, `${path}.institution`, errors);
    checkLocalizedText(entry.studyType, `${path}.studyType`, errors);
    checkLocalizedText(entry.area, `${path}.area`, errors);
    checkString(entry.location, `${path}.location`, errors);
    checkYearMonth(entry.startDate, `${path}.startDate`, errors, false);
    checkYearMonth(entry.endDate, `${path}.endDate`, errors, false);
  });
}

function validateLanguages(value: unknown, errors: Errors): void {
  if (!checkArraySection(value, 'languages', errors)) return;
  value.forEach((entry, index) => {
    const path = `languages[${index}]`;
    if (!isPlainObject(entry)) {
      errors.push(`${path}: expected an object`);
      return;
    }
    checkLocalizedText(entry.language, `${path}.language`, errors);
    checkLocalizedText(entry.fluency, `${path}.fluency`, errors);
  });
}

function validateSkills(value: unknown, errors: Errors): void {
  if (!checkArraySection(value, 'skills', errors)) return;
  value.forEach((entry, index) => {
    const path = `skills[${index}]`;
    if (!isPlainObject(entry)) {
      errors.push(`${path}: expected an object`);
      return;
    }
    checkString(entry.name, `${path}.name`, errors);
    checkLocalizedText(entry.level, `${path}.level`, errors, false);
    checkStringArray(entry.keywords, `${path}.keywords`, errors);
  });
}

/**
 * Validates one parsed section against the shape the resume components expect.
 * Returns an empty array when the value is safe to write to Firebase.
 */
export function validateSection(section: ResumeSectionKey, value: unknown): Errors {
  const errors: Errors = [];

  switch (section) {
    case 'basics':
      validateBasics(value, errors);
      break;
    case 'work':
      validateWork(value, errors);
      break;
    case 'education':
      validateEducation(value, errors);
      break;
    case 'languages':
      validateLanguages(value, errors);
      break;
    case 'skills':
      validateSkills(value, errors);
      break;
  }

  return errors;
}
