import { useState, useEffect } from 'react';
import { usePersonaData } from './firebase-service.ts';
import { groupWorkEntries } from './resume-helpers.ts';
import styles from './MyResume.module.css';
import type { MyResumeProps, Language } from './types.ts';
import {
  LoadingState,
  ErrorState,
  Toolbar,
  BasicInfo,
  Summary,
  WorkExperience,
  EducationSection,
  Languages,
  Skills
} from './components/index.ts';

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
    return <LoadingState />;
  }

  // Error state
  if (error || !resumeData) {
    return <ErrorState error={error} language={resumeLang} />;
  }

  // Main render with data
  const data = resumeData;
  const workItems = groupWorkEntries(data.work);

  return (
    <div className={styles.host}>      
      <Toolbar 
        language={resumeLang}
        persona={persona}
        onLanguageChange={handleLangChange}
        onPersonaChange={handlePersonaChange}
      />

      <div className={styles.container}>
        <BasicInfo basics={data.basics} language={resumeLang} />
        <Summary summary={data.basics.summary} language={resumeLang} />
        <WorkExperience workItems={workItems} language={resumeLang} />
        <EducationSection education={data.education} language={resumeLang} />
        <Languages languages={data.languages} language={resumeLang} />
        <Skills skills={data.skills} language={resumeLang} />
      </div>
    </div>
  );
};

export default MyResume;