import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePersonData, getPersonContactData } from './firebase-service.ts';
import { groupWorkEntries } from './resume-helpers.ts';
import type { MyResumeProps, Language, PersonalInfo } from './types.ts';
import {
  LoadingState,
  ErrorState,
  BasicInfo,
  Summary,
  WorkExperience,
  EducationSection,
  Languages,
  Skills,
  PersonalContact
} from './components/index.ts';

const MyResume = ({ initialPerson = 'yohany' }: MyResumeProps) => {
  const { language } = useParams<{ language?: string }>();

  // Person is provided via initialPerson prop (startup variable); language is still taken from URL
  const currentPerson = initialPerson;
  const currentLanguage = (language === 'es' ? 'es' : 'en') as Language;

  const { data: resumeData, loading, error } = usePersonData(currentPerson);
  const [contactData, setContactData] = useState<PersonalInfo | null>(null);

  // Update document title when data changes
  useEffect(() => {
    if (resumeData) {
      const t = currentLanguage;
      const title = `${resumeData.basics.name} - ${t === 'en' ? 'Resume' : 'Currículum'}`;
      document.title = title;
    }
  }, [resumeData, currentLanguage]);

  // Load private contact data if VITE_SHOW_PRIVATE_INFO is enabled
  useEffect(() => {
    const loadContactData = async () => {
      if (import.meta.env.VITE_SHOW_PRIVATE_INFO === 'true' && currentPerson) {
        const contact = await getPersonContactData(currentPerson);
        setContactData(contact);
      }
    };
    loadContactData();
  }, [currentPerson]);

  // Loading state
  if (loading) {
    return <LoadingState language={currentLanguage} />;
  }

  // Error state
  if (error || !resumeData) {
    return <ErrorState error={error} language={currentLanguage} />;
  }

  // Main render with data
  const data = resumeData;
  const workItems = groupWorkEntries(data.work);

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="resume-container shadow-lg">
        <div className="section-spacing">
          <BasicInfo basics={data.basics} language={currentLanguage} />
          {contactData && <PersonalContact personal={contactData} language={currentLanguage} />}
        </div>
        <div className="section-spacing">
          <Summary summary={data.basics.summary} language={currentLanguage} />
        </div>
        <div className="section-spacing">
          <WorkExperience workItems={workItems} language={currentLanguage} />
        </div>
        <div className="section-spacing">
          <EducationSection education={data.education} language={currentLanguage} />
        </div>
        <div className="section-spacing">
          <Languages languages={data.languages} language={currentLanguage} />
        </div>
        <div className="section-spacing">
          <Skills skills={data.skills} language={currentLanguage} />
        </div>
      </div>
    </div>
  );
};

export default MyResume;