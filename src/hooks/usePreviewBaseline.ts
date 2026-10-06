import { useAppStore } from '../store/useAppStore';
import type { ResumeData, WorkEntry, WorkGroupEntry, WorkPath } from '../types';

/**
 * What Firebase holds while a JSON file is being previewed, or null when there
 * is no preview. Components compare against it to mark what the file changes,
 * so outside a preview they render exactly as before.
 */
export function usePreviewBaseline(): ResumeData | null {
  return useAppStore(state => (state.preview ? state.resumeData : null));
}

/**
 * Previews mark changes in place; this lists the entries of a section that the
 * file drops, so they can still be shown where they were
 */
export function removedTail<T>(baseline: T[] | undefined, current: T[]): T[] {
  return baseline ? baseline.slice(current.length) : [];
}

// The stored work entry or nested role at a path, read loosely: entries are
// matched by position, so the shape on the Firebase side may differ
export type BaselineWork = Partial<WorkEntry> & Partial<Pick<WorkGroupEntry, 'roles'>>;

export function baselineWorkAt(
  baseline: ResumeData | null,
  path: WorkPath | undefined
): BaselineWork | undefined {
  if (!baseline || !path) return undefined;
  const entry = baseline.work[path.entry] as BaselineWork | undefined;
  if (path.role === undefined) return entry;
  return entry?.roles?.[path.role] as BaselineWork | undefined;
}
