import { useState, useEffect } from 'react';
import { usePersonaData } from './firebase-service.ts';
import { groupWorkEntries } from './resume-helpers.ts';
import { useLanguage } from './contexts/LanguageContext.tsx';
import styles from './MyResume.module.css';
import type { MyResumeProps } from './types.ts';
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

const MyResume = ({ initialPersona = 'yohany' }: MyResumeProps) => {
  const { language: resumeLang, setLanguage } = useLanguage();
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
    setLanguage(e.target.value as any);
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
    return <ErrorState error={error} />;
  }

  // Main render with data
  const data = resumeData;
  const workItems = groupWorkEntries(data.work);

  return (
    <div className={styles.host}>      
      <Toolbar 
        persona={persona}
        onLanguageChange={handleLangChange}
        onPersonaChange={handlePersonaChange}
      />

      <div className={styles.container}>
        <BasicInfo basics={data.basics} />
        <Summary summary={data.basics.summary} />
        <WorkExperience workItems={workItems} />
        <EducationSection education={data.education} />
        <Languages languages={data.languages} />
        <Skills skills={data.skills} />
      </div>
    </div>
  );
};

export default MyResume;