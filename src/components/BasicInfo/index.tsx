import React from 'react';
import type { BasicInfoProps } from '../../types.ts';
import { useTranslation } from '../../hooks/useTranslation';
import './styles.css';

const BasicInfo: React.FC<BasicInfoProps> = ({ basics }) => {
  const { t } = useTranslation();
  
  return (
    <section className="basics">
      <div className="basics-header">
        <h1 className="basics-name">{basics.name}</h1>
        <p className="basics-label">{t(basics.label)}</p>
      </div>

      <div className="contact-info">
        <div className="contact-container">
          {basics.profiles.map((p, index) => (
            <div key={index} className="contact-item">
              {/linkedin/i.test(p.url)
                ? <span className="contact-icon-linkedin" aria-hidden="true">in</span>
                : <span className="contact-icon" aria-hidden="true">🔗</span>}
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                {p.url.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;