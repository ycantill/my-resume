import React from 'react';
import type { WorkRole } from '../../../types.ts';
import { formatDateRange, formatDuration } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import Chip from '../../atoms/Chip';
import styles from './styles.module.css';

interface WorkRoleCardProps {
  role: WorkRole;
}

const WorkRoleCard: React.FC<WorkRoleCardProps> = ({ role }) => {
  const { t, language } = useTranslation();
  const isCurrent = !role.endDate;
  const duration = formatDuration(role, language);

  return (
    <div className={styles.root}>
      <div className={styles.dot}></div>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h4 className={styles.title}>{t(role.position)}</h4>
          {isCurrent && (
            <span className={styles.badgeCurrent}>{t('work.currentRole')}</span>
          )}
        </div>
      </div>
      <div className={styles.meta}>
        <p className={styles.metaText}>
          {formatDateRange(role, language)} | {t(role.location)} · {duration}
        </p>
      </div>
      <div className={styles.description}>
        <p className={styles.descriptionText}>{t(role.summary)}</p>
      </div>
      <div className={styles.highlights}>
        <ul className={styles.highlightsList}>
          {role.highlights[language].map((h, index) => (
            <li key={index} className={styles.highlightsItem}>{h}</li>
          ))}
        </ul>
      </div>
      {role.stack && role.stack.length > 0 && (
        <div className={styles.stack}>
          <p className={styles.stackLabel}>{t('work.techStack')}:</p>
          <div className={styles.chips}>
            {role.stack.filter(s => s != null && s !== '').map((s, index) => (
              <Chip key={index}>{s}</Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkRoleCard;

