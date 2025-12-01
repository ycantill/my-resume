import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePersonData, getPersonContactData, isDatabaseConfigured } from './api-service.ts';
import { groupWorkEntries } from './resume-helpers.ts';
import { useTranslation } from './hooks/useTranslation.ts';
import type { MyResumeProps, Language, PersonalInfo, ResumeDataError } from './types.ts';
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

const MyResume = ({ initialPerson }: MyResumeProps) => {
  const { language } = useParams<{ language?: string }>();
  const { t } = useTranslation();

  // Person is provided via initialPerson prop (startup variable); language is still taken from URL
  const currentLanguage = (language === 'es' ? 'es' : 'en') as Language;
  const currentPerson = initialPerson;

  // Hooks must be called unconditionally
  const { data: resumeData, loading, error } = usePersonData(currentPerson);
  const [contactData, setContactData] = useState<PersonalInfo | null>(null);

  // Update document title when data changes
  useEffect(() => {
    if (resumeData) {
      const title = `${resumeData.basics.name} - ${t('document.titleSuffix')}`;
      document.title = title;
    }
  }, [resumeData, t]);

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

  // Early returns after all hooks
  
  // If no person provided, this shouldn't render (handled by AppRouter)
  if (!initialPerson) {
    const configError: ResumeDataError = {
      code: 'INVALID_DATA',
      message: 'No person specified'
    };
    return <ErrorState error={configError} language={currentLanguage} />;
  }

  // Verificar si Database está configurado
  if (!isDatabaseConfigured()) {
    const configError: ResumeDataError = {
      code: 'INVALID_DATA',
      message: 'VITE_DATABASE_URL environment variable is not defined'
    };
    return <ErrorState error={configError} language={currentLanguage} />;
  }

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
          <BasicInfo basics={data.basics} />
          {contactData && <PersonalContact personal={contactData} />}
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