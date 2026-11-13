import React from 'react';
import type { WorkRole } from '../../../types.ts';
import { withLocalized, withLocalizedList } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { usePreviewBaseline, baselineWorkAt } from '../../../hooks/usePreviewBaseline';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import EditableText from '../../atoms/EditableText';
import EditableList from '../EditableList';
import EditableChips from '../EditableChips';
import EntryActions from '../EntryActions';
import WorkMeta from '../WorkMeta';
import { clsx } from 'clsx';
import styles from './styles.module.css';

interface WorkRoleCardProps {
  role: WorkRole;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const WorkRoleCard: React.FC<WorkRoleCardProps> = ({ role, canMoveUp, canMoveDown }) => {
  const { t, language } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const { updateWork, removeWork, moveWork } = useResumeEdit();
  const baseline = usePreviewBaseline();

  const isCurrent = !role.endDate;
  const path = role.sourcePath;
  const stack = role.stack ?? [];

  // Without a path there is nothing to write back to, so the role stays read-only
  if (!path) {
    return null;
  }

  // While previewing: the role Firebase holds here, if any. A role it lacks is
  // outlined as new instead of diffing each field against nothing.
  const prev = baselineWorkAt(baseline, path);
  const diff = baseline !== null && prev !== undefined;

  return (
    <div className={clsx(styles.root, baseline && !prev && 'diff-added-block')}>
      <div className={styles.dot}></div>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <EditableText
            as="h4"
            className={styles.title}
            value={t(role.position)}
            previous={diff ? t(prev.position ?? '') : undefined}
            label={t('editor.position')}
            placeholder={t('editor.position')}
            onCommit={next =>
              updateWork(path, { position: withLocalized(role.position, language, next) })
            }
          />
          {isCurrent && !editMode && (
            <span className={styles.badgeCurrent}>{t('work.currentRole')}</span>
          )}
          <EntryActions
            entryLabel={t(role.position)}
            onMoveUp={canMoveUp ? () => moveWork(path, -1) : undefined}
            onMoveDown={canMoveDown ? () => moveWork(path, 1) : undefined}
            onRemove={() => removeWork(path)}
          />
        </div>
      </div>
      <div className={styles.meta}>
        <WorkMeta
          path={path}
          startDate={role.startDate}
          endDate={role.endDate}
          location={role.location}
          className={styles.metaText}
          previous={diff ? prev : undefined}
        />
      </div>
      <div className={styles.description}>
        <EditableText
          as="p"
          className={styles.descriptionText}
          value={t(role.summary)}
          previous={diff ? t(prev.summary ?? '') : undefined}
          multiline
          label={t('editor.summary')}
          placeholder={t('editor.summary')}
          onCommit={next => updateWork(path, { summary: withLocalized(role.summary, language, next) })}
        />
      </div>
      <div className={styles.highlights}>
        <EditableList
          items={role.highlights?.[language] ?? []}
          previous={diff ? prev.highlights?.[language] ?? [] : undefined}
          className={styles.highlightsList}
          itemClassName={styles.highlightsItem}
          onChange={next =>
            updateWork(path, { highlights: withLocalizedList(role.highlights, language, next) })
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
  );
};

export default WorkRoleCard;
