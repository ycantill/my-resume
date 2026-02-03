import React from 'react';
import type { PersonalContactProps } from '../../types.ts';
import { formatLocationLabel, normalizePhone } from '../../resume-helpers.ts';
import { useTranslation } from '../../hooks/useTranslation';
import './styles.css';

/**
 * PersonalContact Component
 * Displays private contact information (phone, location)
 * Only renders if VITE_SHOW_PRIVATE_INFO environment variable is set to 'true'
 */
const PersonalContact: React.FC<PersonalContactProps> = ({ personal }) => {
  const { language, t } = useTranslation();
  const { location } = personal;

  // Only render if environment variable is set
  const showPrivateInfo = import.meta.env.VITE_SHOW_PRIVATE_INFO === 'true';
  
  if (!showPrivateInfo) {
    return null;
  }

  return (
    <div className="personal-contact-info">
      <div className="contact-wrapper">

        {/* Phone */}
        {personal.phone && (
          <div className="personal-contact-item">
            <span className="personal-contact-icon" aria-hidden="true">📞</span>
            <a 
              href={`tel:${normalizePhone(personal.phone)}`} 
              className="personal-contact-link"
            >
              {personal.phone}
            </a>
          </div>
        )}

        {/* Location */}
        {location && (
          <>
            {personal.phone && <span className="contact-divider">•</span>}
            <div className="personal-contact-item">
              <span className="personal-contact-icon" aria-hidden="true">📍</span>
              <span className="location-label">{formatLocationLabel(location, language)}</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PersonalContact;
