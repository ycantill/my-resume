import React from 'react';
import type { LocalizedText, WorkPath } from '../../../types.ts';
import {
  formatDateRange,
  formatDuration,
  withLocalized,
  currentYearMonth,
} from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResumeEdit } from '../../../hooks/useResumeEdit';
import { useAppStore, selectEditMode } from '../../../store/useAppStore';
import EditableText from '../../atoms/EditableText';
import EditableDate from '../../atoms/EditableDate';
import styles from './styles.module.css';

interface WorkMetaProps {
  path: WorkPath;
  startDate?: string;
  endDate?: string;
  location?: LocalizedText;
  className?: string;
}

/**
 * The "dates | location · duration" line under a job title.
 *
 * In edit mode the dates become native month pickers — a phone opens its own
 * month wheel rather than asking for a typed "YYYY-MM" — and an open end date
 * is expressed by the "current role" checkbox, matching how the data stores it.
 */
const WorkMeta: React.FC<WorkMetaProps> = ({
  path,
  startDate,
  endDate,
  location,
  className,
}) => {
  const { t, language } = useTranslation();
  const editMode = useAppStore(selectEditMode);
  const { updateWork } = useResumeEdit();

  const hasDates = startDate !== undefined;
  const duration = hasDates ? formatDuration({ startDate, endDate }, language) : '';

  if (!editMode) {
    return (
      <p className={className}>
        {hasDates ? formatDateRange({ startDate, endDate }, language) : ''}
        {' | '}
        {location && t(location)} · {duration}
      </p>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.dates}>
        <EditableDate
          value={startDate ?? ''}
          label={t('editor.startDate')}
          onCommit={next => updateWork(path, { startDate: next })}
        />
        <span className={styles.dash}>–</span>
        {endDate === undefined ? (
          <span className={styles.present}>{t('editor.present')}</span>
        ) : (
          <EditableDate
            value={endDate}
            label={t('editor.endDate')}
            onCommit={next => updateWork(path, { endDate: next })}
          />
        )}
      </div>

      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={endDate === undefined}
          className={styles.checkbox}
          onChange={e =>
            updateWork(path, {
              endDate: e.target.checked ? undefined : currentYearMonth(),
            })
          }
        />
        {t('editor.currentRoleToggle')}
      </label>

      <EditableText
        className={styles.location}
        value={location ? t(location) : ''}
        label={t('editor.location')}
        placeholder={t('editor.location')}
        onCommit={next =>
          updateWork(path, { location: withLocalized(location, language, next) })
        }
      />
    </div>
  );
};

export default WorkMeta;
