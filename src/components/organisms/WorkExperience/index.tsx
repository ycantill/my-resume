import React from 'react';
import type { WorkExperienceProps } from '../../../types.ts';
import { formatDateRange, formatDuration } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import WorkRoleCard from '../../molecules/WorkRoleCard';
import Chip from '../../atoms/Chip';
import './styles.css';

const WorkExperience: React.FC<WorkExperienceProps> = ({ workItems }) => {
  const { t, language } = useTranslation();

  return (
    <>
      <h2 className="section-title">{t('sections.experience')}</h2>
      {workItems.map((job, jobIndex) => {
        const isCurrent = !job.endDate;

        if ('roles' in job && Array.isArray(job.roles) && job.roles.length) {
          return (
            <div key={jobIndex} className="job">
              <div className="job-company-header">
                <h3 className="job-company-name">{job.name}</h3>
              </div>
              <div className="job-roles-container">
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
          <div key={jobIndex} className="job">
            <div className="job-simple-header">
              <div className="job-header">
                <div className="job-simple-title-row">
                  <h3 className="job-simple-title">
                    {job.name} – {job.position && t(job.position)}
                  </h3>
                  {isCurrent && (
                    <span className="current-badge">{t('work.currentRole')}</span>
                  )}
                </div>
              </div>
              <div className="job-meta">
                <p className="job-simple-meta">
                  {job.startDate && job.endDate !== undefined
                    ? formatDateRange(job as { startDate: string; endDate?: string }, language)
                    : ''} | {job.location && t(job.location)} · {duration}
                </p>
              </div>
              <div className="job-description">
                <p className="job-simple-description">{job.summary && t(job.summary)}</p>
              </div>
              <div className="job-highlights">
                <ul className="job-simple-highlights">
                  {job.highlights?.[language]?.map((h, hIndex) => (
                    <li key={hIndex} className="job-simple-highlight-item">{h}</li>
                  )) || []}
                </ul>
              </div>
              {job.stack && job.stack.length > 0 && (
                <div className="job-skills">
                  <p className="job-skills-label">{t('work.techStack')}:</p>
                  <div className="skills">
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
