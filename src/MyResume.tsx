import { useEffect } from 'react';
import { usePersonData, getPersonContactData, isDatabaseConfigured } from './api-service.ts';
import { groupWorkEntries } from './resume-helpers.ts';
import { useTranslation } from './hooks/useTranslation.ts';
import { useAppStore, selectResumeData, selectContactData, selectLoading, selectError } from './store/useAppStore.ts';
import type { MyResumeProps, ResumeDataError } from './types.ts';
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

const MyResume = ({ initialPerson, initialLanguage }: MyResumeProps) => {
  const { t } = useTranslation();

  // Get state from Zustand store
  const resumeData = useAppStore(selectResumeData);
  const contactData = useAppStore(selectContactData);
  const loading = useAppStore(selectLoading);
  const error = useAppStore(selectError);
  const language = useAppStore(state => state.language);
  const setLanguage = useAppStore(state => state.setLanguage);
  const setContactData = useAppStore(state => state.setContactData);

  // Sync URL language with store
  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage, setLanguage]);

  // Fetch person data (updates store)
  usePersonData(initialPerson || null);

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
      if (import.meta.env.VITE_SHOW_PRIVATE_INFO === 'true' && initialPerson) {
        const contact = await getPersonContactData(initialPerson);
        setContactData(contact);
      }
    };
    loadContactData();
  }, [initialPerson, setContactData]);

  // Early returns after all hooks
  
  // If no person provided, this shouldn't render (handled by AppRouter)
  if (!initialPerson) {
    const configError: ResumeDataError = {
      code: 'INVALID_DATA',
      message: 'No person specified'
    };
    return <ErrorState error={configError} language={language} />;
  }

  // Verificar si Database está configurado
  if (!isDatabaseConfigured()) {
    const configError: ResumeDataError = {
      code: 'INVALID_DATA',
      message: 'VITE_DATABASE_URL environment variable is not defined'
    };
    return <ErrorState error={configError} language={language} />;
  }

  // Loading state
  if (loading) {
    return <LoadingState language={language} />;
  }

  // Error state
  if (error || !resumeData) {
    return <ErrorState error={error} language={language} />;
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