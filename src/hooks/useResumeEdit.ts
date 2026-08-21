import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { saveResumeSection } from '../api-service';
import { validateSection } from '../resume-validation';
import { isWorkGroup } from '../resume-helpers';
import type {
  ResumeData,
  ResumeBasics,
  WorkItem,
  WorkGroupEntry,
  WorkRole,
  WorkPath,
} from '../types';

// The plain list sections. Work is handled separately: its entries nest.
type ArraySection = 'education' | 'languages' | 'skills';
type ItemOf<K extends ArraySection> = ResumeData[K][number];

/**
 * Write access to the resume for the inline editor.
 *
 * Every mutation applies to the store first so the page reflects the edit
 * immediately, then persists the whole section. A failed write rolls the store
 * back to what the database still holds, so the page never claims a save that
 * did not happen.
 */
export function useResumeEdit() {
  const setResumeSection = useAppStore(state => state.setResumeSection);
  const setSaveState = useAppStore(state => state.setSaveState);

  const updateSection = useCallback(
    async <K extends keyof ResumeData>(section: K, next: ResumeData[K]) => {
      const previous = useAppStore.getState().resumeData?.[section];

      const errors = validateSection(section, next);
      if (errors.length > 0) {
        setSaveState('error', errors[0]);
        return;
      }

      setResumeSection(section, next);
      setSaveState('saving');

      try {
        await saveResumeSection(section, next);
        setSaveState('saved');
      } catch (err) {
        if (previous !== undefined) {
          setResumeSection(section, previous);
        }
        setSaveState('error', err instanceof Error ? err.message : 'Could not save changes');
      }
    },
    [setResumeSection, setSaveState]
  );

  // Reading the list from the store rather than from props keeps rapid edits
  // to different fields from overwriting each other
  const sectionList = useCallback(<K extends ArraySection>(section: K): ItemOf<K>[] => {
    return (useAppStore.getState().resumeData?.[section] ?? []) as ItemOf<K>[];
  }, []);

  const updateBasics = useCallback(
    (patch: Partial<ResumeBasics>) => {
      const basics = useAppStore.getState().resumeData?.basics;
      if (!basics) return Promise.resolve();
      return updateSection('basics', { ...basics, ...patch });
    },
    [updateSection]
  );

  const updateItem = useCallback(
    <K extends ArraySection>(section: K, index: number, patch: Partial<ItemOf<K>>) => {
      const next = sectionList(section).map((item, i) =>
        i === index ? { ...item, ...patch } : item
      );
      return updateSection(section, next as ResumeData[K]);
    },
    [sectionList, updateSection]
  );

  // Used when renaming a company that several roles share
  const patchItems = useCallback(
    <K extends ArraySection>(section: K, indexes: number[], patch: Partial<ItemOf<K>>) => {
      const next = sectionList(section).map((item, i) =>
        indexes.includes(i) ? { ...item, ...patch } : item
      );
      return updateSection(section, next as ResumeData[K]);
    },
    [sectionList, updateSection]
  );

  const addItem = useCallback(
    <K extends ArraySection>(section: K, item: ItemOf<K>) => {
      const next = [...sectionList(section), item];
      return updateSection(section, next as ResumeData[K]);
    },
    [sectionList, updateSection]
  );

  const removeItem = useCallback(
    <K extends ArraySection>(section: K, index: number) => {
      const next = sectionList(section).filter((_, i) => i !== index);
      return updateSection(section, next as ResumeData[K]);
    },
    [sectionList, updateSection]
  );

  const moveItem = useCallback(
    <K extends ArraySection>(section: K, index: number, delta: number) => {
      const list = [...sectionList(section)];
      const target = index + delta;
      if (target < 0 || target >= list.length) return Promise.resolve();
      [list[index], list[target]] = [list[target], list[index]];
      return updateSection(section, list as ResumeData[K]);
    },
    [sectionList, updateSection]
  );

  // Work is addressed by path rather than index: a role may be a top-level
  // entry or nested inside a company that stores several of them
  const workList = useCallback(
    () => [...((useAppStore.getState().resumeData?.work ?? []) as WorkItem[])],
    []
  );

  const updateWork = useCallback(
    (path: WorkPath, patch: Partial<WorkRole> & { name?: string }) => {
      const work = workList();
      const target = work[path.entry];
      if (!target) return Promise.resolve();

      if (path.role === undefined) {
        work[path.entry] = { ...target, ...patch } as WorkItem;
      } else {
        const group = target as WorkGroupEntry;
        work[path.entry] = {
          ...group,
          roles: group.roles.map((role, i) => (i === path.role ? { ...role, ...patch } : role)),
        };
      }

      return updateSection('work', work);
    },
    [workList, updateSection]
  );

  // Renaming a company has to move every entry filed under it, or the grouping
  // splits in two on the next render
  const renameCompany = useCallback(
    (paths: WorkPath[], name: string) => {
      const work = workList();
      for (const path of paths) {
        const target = work[path.entry];
        if (target) work[path.entry] = { ...target, name } as WorkItem;
      }
      return updateSection('work', work);
    },
    [workList, updateSection]
  );

  const addWork = useCallback(
    (entry: WorkItem) => updateSection('work', [...workList(), entry]),
    [workList, updateSection]
  );

  const removeWork = useCallback(
    (path: WorkPath) => {
      const work = workList();
      const target = work[path.entry];
      if (!target) return Promise.resolve();

      if (path.role === undefined || !isWorkGroup(target)) {
        return updateSection('work', work.filter((_, i) => i !== path.entry));
      }

      const roles = target.roles.filter((_, i) => i !== path.role);
      // A company with no roles left has nothing to show
      const next = roles.length
        ? work.map((item, i) => (i === path.entry ? { ...target, roles } : item))
        : work.filter((_, i) => i !== path.entry);

      return updateSection('work', next);
    },
    [workList, updateSection]
  );

  const moveWork = useCallback(
    (path: WorkPath, delta: number) => {
      const work = workList();
      const target = work[path.entry];
      if (!target) return Promise.resolve();

      if (path.role === undefined || !isWorkGroup(target)) {
        const to = path.entry + delta;
        if (to < 0 || to >= work.length) return Promise.resolve();
        [work[path.entry], work[to]] = [work[to], work[path.entry]];
        return updateSection('work', work);
      }

      const roles = [...target.roles];
      const to = path.role + delta;
      if (to < 0 || to >= roles.length) return Promise.resolve();
      [roles[path.role], roles[to]] = [roles[to], roles[path.role]];
      work[path.entry] = { ...target, roles };
      return updateSection('work', work);
    },
    [workList, updateSection]
  );

  return {
    updateSection,
    updateBasics,
    updateItem,
    patchItems,
    addItem,
    removeItem,
    moveItem,
    updateWork,
    addWork,
    renameCompany,
    removeWork,
    moveWork,
  };
}
