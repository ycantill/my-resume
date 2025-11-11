import React from 'react';
import type { PersonalContactProps } from '../types.ts';
import { formatLocationLabel, normalizePhone } from '../resume-helpers.ts';

/**
 * PersonalContact Component
 * Displays private contact information (email, phone, location)
 * Only renders if VITE_SHOW_PRIVATE_INFO environment variable is set to 'true'
 */
const PersonalContact: React.FC<PersonalContactProps> = ({ personal, language }) => {
  const t = language;
  const { location } = personal;

  // Only render if environment variable is set
  const showPrivateInfo = import.meta.env.VITE_SHOW_PRIVATE_INFO === 'true';
  
  if (!showPrivateInfo) {
    return null;
  }

  return (
    <div className="personal-contact-info mt-4">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-sm sm:text-base flex-wrap px-4 py-3 bg-gray-50 rounded-lg">
        
        {/* Email */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <span className="text-lg flex-shrink-0" aria-hidden="true">✉️</span>
          <a 
            href={`mailto:${personal.email}`} 
            className="text-blue-600 hover:text-blue-800 font-medium truncate"
          >
            {personal.email}
          </a>
        </div>

        {/* Phone */}
        {personal.phone && (
          <>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <span className="text-lg flex-shrink-0" aria-hidden="true">📞</span>
              <a 
                href={`tel:${normalizePhone(personal.phone)}`} 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {personal.phone}
              </a>
            </div>
          </>
        )}

        {/* Location */}
        {location && (
          <>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <span className="text-lg flex-shrink-0" aria-hidden="true">📍</span>
              <span className="text-gray-700 font-medium">
                {formatLocationLabel(location, t)}
              </span>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PersonalContact;
