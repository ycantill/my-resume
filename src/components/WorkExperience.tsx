import React from 'react';
import type { WorkExperienceProps } from '../types.ts';
import { formatDateRange, formatDuration } from '../resume-helpers.ts';
import { useTranslation } from '../hooks/useTranslation';

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
              <div className="border-l-4 border-blue-500 pl-6 job-header">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{job.name}</h3>
              </div>
              <div className="space-y-8">
                {job.roles.map((role, roleIndex) => {
                  const roleCurrent = !role.endDate;
                  const roleDuration = formatDuration(role, language);
                  return (
                    <div key={roleIndex} className="job-role relative pl-8 border-l-2 border-gray-200 last:border-l-0">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-2"></div>
                      <div className="job-header">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-800">{t(role.position)}</h4>
                          {roleCurrent && (
                            <span className="current-badge">
                              {t('work.currentRole')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="job-meta">
                        <p className="text-sm text-gray-600 font-medium">
                          {formatDateRange(role, language)} | {t(role.location)} · {roleDuration}
                        </p>
                      </div>
                      <div className="job-description">
                        <p className="text-gray-700 leading-relaxed text-justify">{t(role.summary)}</p>
                      </div>
                      <div className="job-highlights">
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                          {role.highlights[language].map((h, hIndex) => (
                            <li key={hIndex} className="leading-relaxed">{h}</li>
                          ))}
                        </ul>
                      </div>
                      {role.stack && role.stack.length > 0 && (
                        <div className="job-skills">
                          <p className="text-sm font-medium text-gray-800 mb-3">
                            {t('work.techStack')}:
                          </p>
                          <div className="skills">
                            {role.stack.map((s, sIndex) => (
                              <span key={sIndex} className="chip">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
        
        const duration = job.startDate && job.endDate !== undefined 
          ? formatDuration(job as { startDate: string; endDate?: string }, language) 
          : '';
        
        return (
          <div key={jobIndex} className="job">
            <div className="border-l-4 border-blue-500 pl-6">
              <div className="job-header">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {job.name} – {job.position && t(job.position)}
                  </h3>
                  {isCurrent && (
                    <span className="current-badge">
                      {t('work.currentRole')}
                    </span>
                  )}
                </div>
              </div>
              <div className="job-meta">
                <p className="text-sm text-gray-600 font-medium">
                  {job.startDate && job.endDate !== undefined 
                    ? formatDateRange(job as { startDate: string; endDate?: string }, language) 
                    : ''} | {job.location && t(job.location)} · {duration}
                </p>
              </div>
              <div className="job-description">
                <p className="text-gray-700 leading-relaxed text-justify">{job.summary && t(job.summary)}</p>
              </div>
              <div className="job-highlights">
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  {job.highlights?.[language]?.map((h, hIndex) => (
                    <li key={hIndex} className="leading-relaxed">{h}</li>
                  )) || []}
                </ul>
              </div>
              {job.stack && job.stack.length > 0 && (
                <div className="job-skills">
                  <p className="text-sm font-medium text-gray-800 mb-3">
                    {t('work.techStack')}:
                  </p>
                  <div className="skills">
                    {job.stack.map((s, sIndex) => (
                      <span key={sIndex} className="chip">{s}</span>
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