import React from 'react';
import type { BasicInfoProps } from '../types.ts';
import { formatLocationLabel, normalizePhone } from '../resume-helpers.ts';

const BasicInfo: React.FC<BasicInfoProps> = ({ personal, basics, language }) => {
  const t = language;
  const { location } = personal;

  return (
    <section className="basics">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">{basics.name}</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 px-4">{basics.label[t]}</p>
      </div>

      <div className="contact-info">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-8 text-sm sm:text-base flex-wrap px-4">
          
          {/* Email */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <span className="icon text-lg sm:text-xl flex-shrink-0" aria-hidden="true">✉️</span>
            <a href={`mailto:${personal.email}`} className="text-blue-600 hover:text-blue-800 font-medium truncate">{personal.email}</a>
          </div>

          {/* Phone and Location */}
          {location && (
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
              {personal.phone ? (
                <>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="icon text-lg sm:text-xl flex-shrink-0" aria-hidden="true">📞</span>
                    <a href={`tel:${normalizePhone(personal.phone)}`} className="text-blue-600 hover:text-blue-800 font-medium">{personal.phone}</a>
                  </div>
                  <span className="text-gray-400 mx-2 text-lg hidden sm:inline">•</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="icon text-lg sm:text-xl flex-shrink-0 sm:hidden" aria-hidden="true">📍</span>
                    <span className="text-gray-700 font-medium text-center sm:text-left">{formatLocationLabel(location, t)}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="icon text-lg sm:text-xl flex-shrink-0" aria-hidden="true">📍</span>
                  <span className="text-gray-700 font-medium text-center sm:text-left">{formatLocationLabel(location, t)}</span>
                </div>
              )}
            </div>
          )}

          {/* Profiles */}
          {basics.profiles.map((p, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
              {/linkedin/i.test(p.url)
                ? <span className="icon-linkedin bg-blue-600 text-white text-xs sm:text-sm px-2 py-1 rounded font-semibold flex-shrink-0" aria-hidden="true">in</span>
                : <span className="icon text-lg sm:text-xl flex-shrink-0" aria-hidden="true">🔗</span>}
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium truncate max-w-xs sm:max-w-none">
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