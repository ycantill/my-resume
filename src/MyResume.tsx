import { useState, useEffect } from 'react';
import { usePersonaData } from './firebase-service.ts';
import {
  formatDateRange,
  formatDuration,
  printResume,
  formatLocationLabel,
  normalizePhone,
  groupWorkEntries
} from './resume-helpers.ts';
import styles from './MyResume.module.css';
import type { MyResumeProps, Language } from './types.ts';
import { formatErrorMessage } from './types.ts';

const MyResume = ({ initialLang = 'es', initialPersona = 'yohany' }: MyResumeProps) => {
  const [resumeLang, setResumeLang] = useState<Language>(initialLang);
  const [persona, setPersona] = useState<string>(initialPersona);
  
  const { data: resumeData, loading, error } = usePersonaData(persona);

  // Update document title when data changes
  useEffect(() => {
    if (resumeData) {
      const t = resumeLang;
      const title = `${resumeData.basics.name} - ${t === 'en' ? 'Resume' : 'Currículum'}`;
      document.title = title;
    }
  }, [resumeData, resumeLang]);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResumeLang(e.target.value as Language);
  };

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPersona(e.target.value);
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.host}>
        <div className={styles.container}>
          <div className={styles.loadingMessage}>
            <h2>Cargando currículum...</h2>
            <p>Obteniendo datos desde Firebase Realtime Database...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !resumeData) {
    return (
      <div className={styles.host}>
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            <h2>❌ Error al cargar currículum</h2>
            <p>No se pudieron cargar los datos desde Firebase.</p>
            <p>Verifica tu configuración de Firebase y conexión a internet.</p>
            {error && (
              <div>
                <p><strong>Error:</strong> {formatErrorMessage(error, resumeLang)}</p>
                <details>
                  <summary>Detalles técnicos</summary>
                  <p><strong>Código:</strong> {error.code}</p>
                  <p><strong>Mensaje original:</strong> {error.message}</p>
                  {error.personaId && <p><strong>Persona ID:</strong> {error.personaId}</p>}
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main render with data
  const data = resumeData;
  const t = resumeLang;
  const { location } = data.basics;
  const workItems = groupWorkEntries(data.work);

  return (
    <div className={styles.host}>      
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <label htmlFor="lang-select">{t === 'en' ? 'Language:' : 'Idioma:'}</label>
          <select id="lang-select" value={resumeLang} onChange={handleLangChange}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>

          <label htmlFor="persona-select">{t === 'en' ? 'Person:' : 'Persona:'}</label>
          <select id="persona-select" value={persona} onChange={handlePersonaChange}>
            <option value="yohany">Yohany</option>
            <option value="lenicet">Lenicet</option>
          </select>
        </div>
        <div className={styles.toolActions}>
          <button onClick={printResume}>{t === 'en' ? 'Print' : 'Imprimir'}</button>
        </div>
      </div>

      <div className={styles.container}>
        {/* Basic info */}
        <section className={styles.basics}>
          <div className={styles.basicsHeader}>
            <h1>{data.basics.name}</h1>
            <p className={styles.subtitle}>{data.basics.label[t]}</p>
          </div>

          <div className={styles.basicsMeta}>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.icon} aria-hidden="true">✉️</span>
                <a href={`mailto:${data.basics.email}`}>{data.basics.email}</a>
              </li>
            </ul>

            <div className={styles.profileLinks}>
              <ul className={styles.contactList}>
                {data.basics.profiles.map((p, index) => (
                  <li key={index}>
                    {/linkedin/i.test(p.url)
                      ? <span className={`${styles.icon} ${styles.iconLinkedin}`} aria-hidden="true">in</span>
                      : <span className={styles.icon} aria-hidden="true">🔗</span>}
                    <a href={p.url} target="_blank" rel="noopener noreferrer">{p.url}</a>
                  </li>
                ))}
              </ul>
            </div>

            <ul className={styles.contactList}>
              {location && (
                <li>
                  {location.phone
                    ? <>
                        <span className={styles.icon} aria-hidden="true">📞</span>
                        <a href={`tel:${normalizePhone(location.phone)}`}>{location.phone}</a>
                      </>
                    : <span className={styles.icon} aria-hidden="true">📍</span>}
                  <span className={styles.muted}>{formatLocationLabel(location, t)}</span>
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* Summary section */}
        <h2>{t === 'en' ? 'Summary' : 'Resumen'}</h2>
        <div className={styles.sectionCard}>
          <p>{data.basics.summary[t]}</p>
        </div>

        {/* Work section */}
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
          
          const duration = job.startDate && job.endDate !== undefined ? formatDuration(job as { startDate: string; endDate?: string }, t) : '';
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
                {job.startDate && job.endDate !== undefined ? formatDateRange(job as { startDate: string; endDate?: string }, t) : ''} | {job.location?.[t]} · {duration}
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

        {/* Education section */}
        <h2>{t === 'en' ? 'Education' : 'Educación'}</h2>
        {data.education.map((edu, eduIndex) => (
          <div key={eduIndex} className={styles.sectionCard}>
            <strong>{edu.institution}</strong><br />
            {edu.studyType[t]} {t === 'en' ? 'in' : 'en'} {edu.area[t]}<br />
            <small>{edu.location}</small>
          </div>
        ))}

        {/* Languages section */}
        <h2>{t === 'en' ? 'Languages' : 'Idiomas'}</h2>
        <div className={styles.sectionCard}>
          <ul>
            {data.languages.map((lang, langIndex) => (
              <li key={langIndex}>{lang.language[t]} – {lang.fluency[t]}</li>
            ))}
          </ul>
        </div>

        {/* Global skills section */}
        <h2>{t === 'en' ? 'Technical Skills' : 'Habilidades Técnicas'}</h2>
        {data.skills.map((skill, skillIndex) => (
          <div key={skillIndex} className={`${styles.sectionCard} ${styles.skillCategory}`}>
            <h3 className={styles.skillCategoryName}>{skill.name}</h3>
            <span className={styles.skillLevel}>{skill.level[t]}</span>
            <div className={styles.skills}>
              {skill.keywords.map((k, kIndex) => (
                <span key={kIndex} className={styles.chip}>{k}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyResume;