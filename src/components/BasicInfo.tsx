import React from 'react';
import type { BasicInfoProps } from '../types.ts';
import { formatLocationLabel, normalizePhone } from '../resume-helpers.ts';

const BasicInfo: React.FC<BasicInfoProps> = ({ basics, language }) => {
  const t = language;
  const { location } = basics;

  return (
    <section className="basics">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{basics.name}</h1>
        <p className="text-xl md:text-2xl text-gray-600">{basics.label[t]}</p>
      </div>

      <div className="contact-info">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-base flex-wrap">
          
          {/* Email */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span className="icon text-xl" aria-hidden="true">✉️</span>
            <a href={`mailto:${basics.email}`} className="text-blue-600 hover:text-blue-800 font-medium">{basics.email}</a>
          </div>

          {/* Phone and Location */}
          {location && (
            <div className="flex items-center gap-3 whitespace-nowrap">
              {location.phone ? (
                <>
                  <span className="icon text-xl" aria-hidden="true">📞</span>
                  <a href={`tel:${normalizePhone(location.phone)}`} className="text-blue-600 hover:text-blue-800 font-medium">{location.phone}</a>
                  <span className="text-gray-400 mx-3 text-lg">•</span>
                  <span className="text-gray-700 font-medium">{formatLocationLabel(location, t)}</span>
                </>
              ) : (
                <>
                  <span className="icon text-xl" aria-hidden="true">📍</span>
                  <span className="text-gray-700 font-medium">{formatLocationLabel(location, t)}</span>
                </>
              )}
            </div>
          )}

          {/* Profiles */}
          {basics.profiles.map((p, index) => (
            <div key={index} className="flex items-center gap-3 whitespace-nowrap">
              {/linkedin/i.test(p.url)
                ? <span className="icon-linkedin bg-blue-600 text-white text-sm px-2 py-1 rounded font-semibold" aria-hidden="true">in</span>
                : <span className="icon text-xl" aria-hidden="true">🔗</span>}
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
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