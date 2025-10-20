import React from 'react';
import styles from '../MyResume.module.css';
import type { GroupedWorkEntry, Language } from '../types.ts';
import { formatDateRange, formatDuration } from '../resume-helpers.ts';

interface WorkExperienceProps {
  workItems: GroupedWorkEntry[];
  language: Language;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ workItems, language }) => {
  const t = language;

  return (
    <>
      <h2>{t === 'en' ? 'Experience' : 'Experiencia'}</h2>
      {workItems.map((job, jobIndex) => {
        const isCurrent = !job.endDate;
        
        if (Array.isArray(job.roles) && job.roles.length) {
          return (
            <div key={jobIndex} className={styles.job}>
              <h3>{job.name}</h3>
              {job.roles.map((role, roleIndex) => {
                const roleCurrent = !role.endDate;
                const roleDuration = formatDuration(role, t);
                return (
                  <div key={roleIndex} className={styles.role}>
                    <div className={styles.roleTitle}>
                      {role.position[t]}
                      {roleCurrent && (
                        <span className={styles.currentBadge}>
                          {t === 'en' ? 'Current role' : 'Puesto actual'}
                        </span>
                      )}
                    </div>
                    <small>
                      {formatDateRange(role, t)} | {role.location[t]} · {roleDuration}
                    </small>
                    <p>{role.summary[t]}</p>
                    <ul>
                      {role.highlights[t].map((h, hIndex) => (
                        <li key={hIndex}>{h}</li>
                      ))}
                    </ul>
                    {role.stack && role.stack.length > 0 && (
                      <div className={styles.jobSkills}>
                        <strong>{t === 'en' ? 'Tech stack' : 'Stack técnico'}:</strong>
                        <div className={styles.skills}>
                          {role.stack.map((s, sIndex) => (
                            <span key={sIndex} className={styles.chip}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
        
        const duration = job.startDate && job.endDate !== undefined 
          ? formatDuration(job as { startDate: string; endDate?: string }, t) 
          : '';
        
        return (
          <div key={jobIndex} className={styles.job}>
            <h3>
              {job.name} – {job.position?.[t]}
              {isCurrent && (
                <span className={styles.currentBadge}>
                  {t === 'en' ? 'Current role' : 'Puesto actual'}
                </span>
              )}
            </h3>
            <small>
              {job.startDate && job.endDate !== undefined 
                ? formatDateRange(job as { startDate: string; endDate?: string }, t) 
                : ''} | {job.location?.[t]} · {duration}
            </small>
            <p>{job.summary?.[t]}</p>
            <ul>
              {job.highlights?.[t]?.map((h, hIndex) => (
                <li key={hIndex}>{h}</li>
              )) || []}
            </ul>
            {job.stack && job.stack.length > 0 && (
              <div className={styles.jobSkills}>
                <strong>{t === 'en' ? 'Tech stack' : 'Stack técnico'}:</strong>
                <div className={styles.skills}>
                  {job.stack.map((s, sIndex) => (
                    <span key={sIndex} className={styles.chip}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default WorkExperience;