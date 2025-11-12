import React from 'react';
import type { PersonalContactProps } from '../../types.ts';
import { formatLocationLabel, normalizePhone } from '../../resume-helpers.ts';
import { useTranslation } from '../../hooks/useTranslation';
import './styles.css';

/**
 * PersonalContact Component
 * Displays private contact information (email, phone, location)
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
        
        {/* Email */}
        <div className="contact-item">
          <span className="contact-icon" aria-hidden="true">✉️</span>
          <a 
            href={`mailto:${personal.email}`} 
            className="contact-link"
          >
            {personal.email}
          </a>
        </div>

        {/* Phone */}
        {personal.phone && (
          <>
            <span className="contact-divider">•</span>
            <div className="contact-item">
              <span className="contact-icon" aria-hidden="true">📞</span>
              <a 
                href={`tel:${normalizePhone(personal.phone)}`} 
                className="contact-link"
              >
                {personal.phone}
              </a>
            </div>
          </>
        )}

        {/* Location */}
        {location && (
          <>
            <span className="contact-divider">•</span>
            <div className="location-wrapper">
              <div className="contact-item location-header">
                <span className="contact-icon" aria-hidden="true">📍</span>
                <span className="location-label">{formatLocationLabel(location, language)}</span>
              </div>
              <div className="location-details">
                {location.city && (
                  <p className="location-line">{location.city}</p>
                )}
                {location.region && location.countryCode && (
                  <p className="location-line">
                    {t(location.region)}, {location.countryCode}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PersonalContact;
