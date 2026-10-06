// Compares two versions of the resume — what Firebase holds and a previewed
// JSON file — and lists what would change, grouped by section and entry.
import { RESUME_SECTIONS, type ResumeSectionKey } from './resume-validation.ts';
import type { Language, ResumeData } from './types.ts';

export type ChangeKind = 'added' | 'removed' | 'changed' | 'reordered';

export interface ResumeChange {
  kind: ChangeKind;
  // Path below the entry, e.g. ['roles', 0, 'highlights', 'es']
  field: (string | number)[];
  before?: string;
  after?: string;
}

export interface ResumeChangeGroup {
  section: ResumeSectionKey;
  // Index in the section's list; absent for basics
  entry?: number;
  // Company, school, language or skill category the changes belong to
  title: string;
  changes: ResumeChange[];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isLeaf(value: unknown): boolean {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

// A one-line stand-in for a whole entry that was added or removed, in the
// language being viewed when the entry is localized
function summarize(value: unknown, language: Language): string {
  if (value === undefined || value === null) return '';
  if (isLeaf(value)) return String(value);
  if (Array.isArray(value)) {
    return value.map(item => summarize(item, language)).filter(Boolean).join(', ');
  }
  if (isPlainObject(value)) {
    if (typeof value[language] === 'string') return value[language] as string;
    const parts = Object.entries(value)
      .filter(([key]) => !['highlights', 'summary', 'roles'].includes(key))
      .map(([, item]) => summarize(item, language))
      .filter(Boolean);
    return parts.slice(0, 4).join(' · ');
  }
  return '';
}

function compare(
  before: unknown,
  after: unknown,
  field: (string | number)[],
  language: Language,
  out: ResumeChange[]
): void {
  if (before === undefined && after === undefined) return;

  // A whole object or list that exists on one side only is one change, not
  // one per field inside it
  if (before === undefined || after === undefined) {
    const present = before ?? after;
    // An empty value and a missing one look the same on the page
    if (present === '' || (Array.isArray(present) && present.length === 0)) return;
    if (isPlainObject(present) && Object.keys(present).length === 0) return;
    out.push(
      before === undefined
        ? { kind: 'added', field, after: summarize(after, language) }
        : { kind: 'removed', field, before: summarize(before, language) }
    );
    return;
  }

  // Bullets, tech stack and keywords: match items by text, so adding one at the
  // top shows as one addition instead of every item below it changing
  if (isStringList(before) && isStringList(after)) {
    const removed = before.filter(item => !after.includes(item));
    const added = after.filter(item => !before.includes(item));
    removed.forEach(item => out.push({ kind: 'removed', field, before: item }));
    added.forEach(item => out.push({ kind: 'added', field, after: item }));
    if (removed.length === 0 && added.length === 0 && before.join('\n') !== after.join('\n')) {
      out.push({ kind: 'reordered', field });
    }
    return;
  }

  if (Array.isArray(before) || Array.isArray(after)) {
    const a = Array.isArray(before) ? before : [];
    const b = Array.isArray(after) ? after : [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      compare(a[i], b[i], [...field, i], language, out);
    }
    return;
  }

  if (isPlainObject(before) || isPlainObject(after)) {
    const a = isPlainObject(before) ? before : {};
    const b = isPlainObject(after) ? after : {};
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
    keys.forEach(key => compare(a[key], b[key], [...field, key], language, out));
    return;
  }

  if (String(before) !== String(after)) {
    out.push({ kind: 'changed', field, before: String(before), after: String(after) });
  }
}

function entryTitle(section: ResumeSectionKey, entry: unknown, language: Language): string {
  if (!isPlainObject(entry)) return '';
  const pick = (value: unknown) =>
    typeof value === 'string' ? value : isPlainObject(value) ? String(value[language] ?? '') : '';
  switch (section) {
    case 'work':
    case 'skills':
      return pick(entry.name);
    case 'education':
      return pick(entry.institution);
    case 'languages':
      return pick(entry.language);
    default:
      return '';
  }
}

/**
 * Lists every difference between two versions of the resume, grouped by
 * section and by entry within list sections. Entries are matched by position.
 */
export function diffResume(
  before: ResumeData,
  after: ResumeData,
  language: Language
): ResumeChangeGroup[] {
  const groups: ResumeChangeGroup[] = [];

  for (const section of RESUME_SECTIONS) {
    const a: unknown = before[section];
    const b: unknown = after[section];

    if (section === 'basics') {
      const changes: ResumeChange[] = [];
      compare(a, b, [], language, changes);
      if (changes.length) groups.push({ section, title: '', changes });
      continue;
    }

    const listA = Array.isArray(a) ? a : [];
    const listB = Array.isArray(b) ? b : [];
    for (let i = 0; i < Math.max(listA.length, listB.length); i++) {
      const changes: ResumeChange[] = [];
      compare(listA[i], listB[i], [], language, changes);
      if (changes.length) {
        groups.push({
          section,
          entry: i,
          title: entryTitle(section, listB[i] ?? listA[i], language),
          changes,
        });
      }
    }
  }

  return groups;
}

export type WordDiffPart = { type: 'same' | 'added' | 'removed'; text: string };

/**
 * Word-level diff of two texts, so an edited summary shows which words changed
 * instead of two near-identical paragraphs. Returns null when the texts are too
 * long to compare cheaply; the caller then shows them whole.
 */
export function diffWords(before: string, after: string): WordDiffPart[] | null {
  const a = before.split(/(\s+)/);
  const b = after.split(/(\s+)/);
  if (a.length * b.length > 400_000) return null;

  // Longest common subsequence table, filled from the end
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const parts: WordDiffPart[] = [];
  const push = (type: WordDiffPart['type'], text: string) => {
    const last = parts[parts.length - 1];
    if (last && last.type === type) last.text += text;
    else parts.push({ type, text });
  };

  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      push('same', a[i]);
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      push('removed', a[i++]);
    } else {
      push('added', b[j++]);
    }
  }
  while (i < a.length) push('removed', a[i++]);
  while (j < b.length) push('added', b[j++]);

  return parts;
}
