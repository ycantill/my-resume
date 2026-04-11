import React from 'react';
import type { WorkRole } from '../../../types.ts';
import { formatDateRange, formatDuration } from '../../../resume-helpers.ts';
import { useTranslation } from '../../../hooks/useTranslation';
import Chip from '../../atoms/Chip';

interface WorkRoleCardProps {
  role: WorkRole;
}

const WorkRoleCard: React.FC<WorkRoleCardProps> = ({ role }) => {
  const { t, language } = useTranslation();
  const isCurrent = !role.endDate;
  const duration = formatDuration(role, language);

  return (
    <div className="job-role">
      <div className="job-role-dot"></div>
      <div className="job-header">
        <div className="job-title-row">
          <h4 className="job-title">{t(role.position)}</h4>
          {isCurrent && (
            <span className="current-badge">{t('work.currentRole')}</span>
          )}
        </div>
      </div>
      <div className="job-meta">
        <p className="job-meta-text">
          {formatDateRange(role, language)} | {t(role.location)} · {duration}
        </p>
      </div>
      <div className="job-description">
        <p className="job-description-text">{t(role.summary)}</p>
      </div>
      <div className="job-highlights">
        <ul className="job-highlights-list">
          {role.highlights[language].map((h, index) => (
            <li key={index} className="job-highlights-item">{h}</li>
          ))}
        </ul>
      </div>
      {role.stack && role.stack.length > 0 && (
        <div className="job-skills">
          <p className="job-skills-label">{t('work.techStack')}:</p>
          <div className="skills">
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
