import React from 'react';
import type { WorkExperienceProps } from '../../../types.ts';
import { formatDateRange, formatDuration } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import WorkRoleCard from '../../molecules/WorkRoleCard';
import Chip from '../../atoms/Chip';
import styles from './styles.module.css';

const WorkExperience: React.FC<WorkExperienceProps> = ({ workItems }) => {
  const { t, language } = useTranslation();

  return (
    <>
      <h2 className="section-title">{t('sections.experience')}</h2>
      {workItems.map((job, jobIndex) => {
        const isCurrent = !job.endDate;

        if ('roles' in job && Array.isArray(job.roles) && job.roles.length) {
          return (
            <div key={jobIndex} className={styles.entry}>
              <div className={styles.companyHeader}>
                <h3 className={styles.companyName}>{job.name}</h3>
              </div>
              <div className={styles.roles}>
                {job.roles.map((role, roleIndex) => (
                  <WorkRoleCard key={roleIndex} role={role} />
                ))}
              </div>
            </div>
          );
        }

        const duration = job.startDate && job.endDate !== undefined
          ? formatDuration(job as { startDate: string; endDate?: string }, language)
          : '';

        return (
          <div key={jobIndex} className={styles.entry}>
            <div className={styles.simpleHeader}>
              <div className={styles.header}>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>
                    {job.name} – {job.position && t(job.position)}
                  </h3>
                  {isCurrent && (
                    <span className={styles.badgeCurrent}>{t('work.currentRole')}</span>
                  )}
                </div>
              </div>
              <div className={styles.meta}>
                <p className={styles.metaText}>
                  {job.startDate && job.endDate !== undefined
                    ? formatDateRange(job as { startDate: string; endDate?: string }, language)
                    : ''} | {job.location && t(job.location)} · {duration}
                </p>
              </div>
              <div className={styles.description}>
                <p className={styles.descriptionText}>{job.summary && t(job.summary)}</p>
              </div>
              <div className={styles.highlights}>
                <ul className={styles.highlightsList}>
                  {job.highlights?.[language]?.map((h, hIndex) => (
                    <li key={hIndex} className={styles.highlightsItem}>{h}</li>
                  )) || []}
                </ul>
              </div>
              {job.stack && job.stack.length > 0 && (
                <div className={styles.stack}>
                  <p className={styles.stackLabel}>{t('work.techStack')}:</p>
                  <div className={styles.chips}>
                    {job.stack.filter(s => s != null && s !== '').map((s, sIndex) => (
                      <Chip key={sIndex}>{s}</Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default WorkExperience;
