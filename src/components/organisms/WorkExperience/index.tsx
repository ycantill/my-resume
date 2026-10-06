import React from 'react';
import type { WorkExperienceProps } from '../../../types.ts';
import { withLocalized, withLocalizedList, createWorkEntry } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { usePreviewBaseline, baselineWorkAt } from '../../../hooks/usePreviewBaseline';
import { useAppStore, selectEditMode, selectResumeData } from '../../../store/useAppStore';
import WorkRoleCard from '../../molecules/WorkRoleCard';
import WorkMeta from '../../molecules/WorkMeta';
import EditableText from '../../atoms/EditableText';
import DiffText from '../../atoms/DiffText';
import EditableList from '../../molecules/EditableList';
import EditableChips from '../../molecules/EditableChips';
import EntryActions from '../../molecules/EntryActions';
import RemovedEntries from '../../molecules/RemovedEntries';
import { clsx } from 'clsx';
import styles from './styles.module.css';

const WorkExperience: React.FC<WorkExperienceProps> = ({ workItems }) => {
  const { t, language } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const resumeData = useAppStore(selectResumeData);
  const { updateWork, addWork, renameCompany, removeWork, moveWork } = useResumeEdit();
  const baseline = usePreviewBaseline();
  const previewWork = useAppStore(state => state.preview?.data.work);

  // Companies are a view over the stored list; edits address the stored paths
  const storedCount = resumeData?.work?.length ?? 0;

  return (
    <>
      <h2 className="section-title">{t('sections.experience')}</h2>
      {workItems.map((job, jobIndex) => {
        const isCurrent = !job.endDate;
        const roles = job.roles ?? [];
        const paths = job.sourcePaths ?? [];
        const path = job.sourcePath;

        const commitCompanyName = (name: string) => renameCompany(paths, name);

        // While previewing: the stored entry this company starts at, by position
        const prevCompany = baselineWorkAt(baseline, paths[0]);

        if (roles.length > 0) {
          // Roles a nested company had in Firebase and the file drops
          const storedRoles = prevCompany?.roles ?? [];
          const removedRoles =
            paths.length === 1 && roles[0]?.sourcePath?.role !== undefined
              ? storedRoles.slice(roles.length)
              : [];

          return (
            <div
              key={jobIndex}
              className={clsx(styles.entry, baseline && !prevCompany && 'diff-added-block')}
            >
              <div className={styles.companyHeader}>
                <div className={styles.companyRow}>
                  <EditableText
                    as="h3"
                    className={styles.companyName}
                    value={job.name}
                    previous={prevCompany ? prevCompany.name ?? '' : undefined}
                    label={t('editor.company')}
                    placeholder={t('editor.company')}
                    onCommit={commitCompanyName}
                  />
                </div>
              </div>
              <div className={styles.roles}>
                {roles.map((role, roleIndex) => {
                  // Nested roles reorder within the company; flat ones that merely
                  // share a name reorder within the stored list
                  const nested = role.sourcePath?.role !== undefined;
                  const position = nested ? roleIndex : role.sourcePath?.entry ?? 0;
                  const length = nested ? roles.length : storedCount;
                  return (
                    <WorkRoleCard
                      key={roleIndex}
                      role={role}
                      canMoveUp={position > 0}
                      canMoveDown={position < length - 1}
                    />
                  );
                })}
                <RemovedEntries entries={removedRoles} />
              </div>
            </div>
          );
        }

        if (!path) return null;

        const stack = job.stack ?? [];
        const prev = baselineWorkAt(baseline, path);
        const diff = baseline !== null && prev !== undefined;

        return (
          <div
            key={jobIndex}
            className={clsx(styles.entry, baseline && !prev && 'diff-added-block')}
          >
            <div className={styles.simpleHeader}>
              <div className={styles.header}>
                <div className={styles.titleRow}>
                  {editMode ? (
                    <h3 className={styles.title}>
                      <EditableText
                        value={job.name}
                        label={t('editor.company')}
                        placeholder={t('editor.company')}
                        onCommit={commitCompanyName}
                      />
                      {' – '}
                      <EditableText
                        value={job.position ? t(job.position) : ''}
                        label={t('editor.position')}
                        placeholder={t('editor.position')}
                        onCommit={next =>
                          updateWork(path, { position: withLocalized(job.position, language, next) })
                        }
                      />
                    </h3>
                  ) : (
                    <h3 className={styles.title}>
                      {diff ? (
                        <DiffText
                          before={`${prev.name ?? ''} – ${t(prev.position ?? '')}`}
                          after={`${job.name} – ${job.position ? t(job.position) : ''}`}
                        />
                      ) : (
                        <>
                          {job.name} – {job.position && t(job.position)}
                        </>
                      )}
                    </h3>
                  )}
                  {isCurrent && !editMode && (
                    <span className={styles.badgeCurrent}>{t('work.currentRole')}</span>
                  )}
                  <EntryActions
                    entryLabel={job.name}
                    onMoveUp={path.entry > 0 ? () => moveWork(path, -1) : undefined}
                    onMoveDown={path.entry < storedCount - 1 ? () => moveWork(path, 1) : undefined}
                    onRemove={() => removeWork(path)}
                  />
                </div>
              </div>
              <div className={styles.meta}>
                <WorkMeta
                  path={path}
                  startDate={job.startDate}
                  endDate={job.endDate}
                  location={job.location}
                  className={styles.metaText}
                  previous={diff ? prev : undefined}
                />
              </div>
              <div className={styles.description}>
                <EditableText
                  as="p"
                  className={styles.descriptionText}
                  value={job.summary ? t(job.summary) : ''}
                  previous={diff ? t(prev.summary ?? '') : undefined}
                  multiline
                  label={t('editor.summary')}
                  placeholder={t('editor.summary')}
                  onCommit={next =>
                    updateWork(path, { summary: withLocalized(job.summary, language, next) })
                  }
                />
              </div>
              <div className={styles.highlights}>
                <EditableList
                  items={job.highlights?.[language] ?? []}
                  previous={diff ? prev.highlights?.[language] ?? [] : undefined}
                  className={styles.highlightsList}
                  itemClassName={styles.highlightsItem}
                  onChange={next =>
                    updateWork(path, {
                      highlights: withLocalizedList(job.highlights, language, next),
                    })
                  }
                />
              </div>
              {(stack.length > 0 || editMode) && (
                <div className={styles.stack}>
                  <p className={styles.stackLabel}>{t('work.techStack')}:</p>
                  <div className={styles.chips}>
                    <EditableChips
                      items={stack}
                      previous={diff ? prev.stack ?? [] : undefined}
                      label={t('editor.techStack')}
                      onChange={next => updateWork(path, { stack: next })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <RemovedEntries entries={baseline && previewWork ? baseline.work.slice(previewWork.length) : []} />
      {editMode && (
        <button
          type="button"
          onClick={() => addWork(createWorkEntry())}
          className={styles.add}
        >
          + {t('editor.addExperience')}
        </button>
      )}
    </>
  );
};

export default WorkExperience;
