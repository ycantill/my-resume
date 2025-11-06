import { useState, useEffect } from 'react';
import { usePersonData } from './firebase-service.ts';
import { groupWorkEntries } from './resume-helpers.ts';
import { useLanguage } from './contexts/LanguageContext.tsx';
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

const MyResume = ({ initialPerson = 'yohany' }: MyResumeProps) => {
  const { language: resumeLang, setLanguage } = useLanguage();
  const [person, setPerson] = useState<string>(initialPerson);
  
  const { data: resumeData, loading, error } = usePersonData(person);

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

  const handlePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerson(e.target.value);
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
    <div className="min-h-screen bg-gray-50">      
      <Toolbar 
        person={person}
        onLanguageChange={handleLangChange}
        onPersonChange={handlePersonChange}
      />

      <div className="resume-container shadow-lg">
        <div className="section-spacing">
          <BasicInfo basics={data.basics} />
        </div>
        <div className="section-spacing">
          <Summary summary={data.basics.summary} />
        </div>
        <div className="section-spacing">
          <WorkExperience workItems={workItems} />
        </div>
        <div className="section-spacing">
          <EducationSection education={data.education} />
        </div>
        <div className="section-spacing">
          <Languages languages={data.languages} />
        </div>
        <div className="section-spacing">
          <Skills skills={data.skills} />
        </div>
      </div>
    </div>
  );
};

export default MyResume;