import React, { useMemo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore, selectPreview, selectResumeData } from '../../../store/useAppStore';
import { diffResume, diffWords, type ResumeChange } from '../../../resume-diff';
import styles from './styles.module.css';

// Field names in the data mapped to the labels the inline editor already uses
const FIELD_LABELS: Record<string, string> = {
  name: 'editor.name',
  label: 'editor.jobTitle',
  email: 'editor.email',
  summary: 'editor.summary',
  profiles: 'editor.profileUrl',
  position: 'editor.position',
  location: 'editor.location',
  startDate: 'editor.startDate',
  endDate: 'editor.endDate',
  highlights: 'editor.highlight',
  stack: 'editor.techStack',
  institution: 'editor.institution',
  studyType: 'editor.studyType',
  area: 'editor.area',
  language: 'editor.language',
  fluency: 'editor.fluency',
  keywords: 'editor.keyword',
  roles: 'editor.position',
};

const SECTION_LABELS: Record<string, string> = {
  basics: 'editor.diff.basics',
  work: 'sections.experience',
  education: 'sections.education',
  languages: 'sections.languages',
  skills: 'sections.skills',
};

const SYMBOLS: Record<ResumeChange['kind'], string> = {
  added: '+',
  removed: '−',
  changed: '~',
  reordered: '↕',
};

// What a previewed file would change compared with what Firebase holds now,
// shown above the resume while previewing. Screen only.
const PreviewDiff: React.FC = () => {
  const { t, language } = useTranslation();
  const preview = useAppStore(selectPreview);
  const current = useAppStore(selectResumeData);

  const groups = useMemo(
    () => (preview && current ? diffResume(current, preview.data, language) : []),
    [preview, current, language]
  );

  if (!preview || !current) return null;

  const total = groups.reduce((sum, group) => sum + group.changes.length, 0);

  const fieldLabel = (field: (string | number)[]) =>
    field
      .map(part => {
        if (typeof part === 'number') return `#${part + 1}`;
        if (part === 'en' || part === 'es') return part.toUpperCase();
        return FIELD_LABELS[part] ? t(FIELD_LABELS[part]) : part;
      })
      .join(' › ');

  const renderValue = (change: ResumeChange) => {
    if (change.kind === 'reordered') {
      return <span className={styles.note}>{t('editor.diff.reordered')}</span>;
    }
    if (change.kind === 'added') return <ins className={styles.added}>{change.after}</ins>;
    if (change.kind === 'removed') return <del className={styles.removed}>{change.before}</del>;

    const parts = diffWords(change.before ?? '', change.after ?? '');
    if (!parts) {
      return (
        <>
          <del className={styles.removed}>{change.before}</del>{' '}
          <ins className={styles.added}>{change.after}</ins>
        </>
      );
    }
    return parts.map((part, index) =>
      part.type === 'same' ? (
        <span key={index}>{part.text}</span>
      ) : part.type === 'added' ? (
        <ins key={index} className={styles.added}>{part.text}</ins>
      ) : (
        <del key={index} className={styles.removed}>{part.text}</del>
      )
    );
  };

  return (
    <details className={styles.diff} open>
      <summary className={styles.diff__summary}>
        {total === 0
          ? t('editor.diff.none')
          : t('editor.diff.title').replace('{count}', String(total))}
      </summary>
      {groups.map(group => (
        <section key={`${group.section}-${group.entry ?? ''}`} className={styles.diff__group}>
          <h3 className={styles.diff__heading}>
            {t(SECTION_LABELS[group.section])}
            {group.title && <span className={styles.diff__entry}> · {group.title}</span>}
          </h3>
          <ul className={styles.diff__list}>
            {group.changes.map((change, index) => (
              <li key={index} className={styles.diff__item}>
                <span className={styles[`symbol--${change.kind}`]} aria-label={t(`editor.diff.${change.kind}`)}>
                  {SYMBOLS[change.kind]}
                </span>
                <div className={styles.diff__body}>
                  {change.field.length > 0 && (
                    <div className={styles.diff__field}>{fieldLabel(change.field)}</div>
                  )}
                  <div className={styles.diff__value}>{renderValue(change)}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </details>
  );
};

export default PreviewDiff;
