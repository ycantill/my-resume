import { useEffect } from 'react';
import { usePersonData, isDatabaseConfigured } from './api-service.ts';
import { groupWorkEntries } from './resume-helpers.ts';
import { useTranslation } from './hooks/useTranslation.ts';
import { useAuth } from './hooks/useAuth.ts';
import {
  useAppStore,
  selectResumeData,
  selectLoading,
  selectError,
  selectPreview,
} from './store/useAppStore.ts';
import type { MyResumeProps, ResumeDataError } from './types.ts';
import {
  LoadingState,
  ErrorState,
  ActionBar,
  BasicInfo,
  Summary,
  WorkExperience,
  EducationSection,
  Languages,
  Skills,
  PersonalContact,
  PreviewDiff,
} from './components/index.ts';

const MyResume = ({ initialLanguage, initialLocation }: MyResumeProps) => {
  const { t } = useTranslation();

  // Get state from Zustand store
  const resumeData = useAppStore(selectResumeData);
  const loading = useAppStore(selectLoading);
  const error = useAppStore(selectError);
  const preview = useAppStore(selectPreview);
  const language = useAppStore(state => state.language);
  const setLanguage = useAppStore(state => state.setLanguage);
  const setLocationSlug = useAppStore(state => state.setLocationSlug);

  // Initialize Firebase auth listener
  useAuth();

  // Sync URL language with store
  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage, setLanguage]);

  // Sync URL location with store
  useEffect(() => {
    setLocationSlug(initialLocation ?? null);
  }, [initialLocation, setLocationSlug]);

  // Fetch resume data (updates store)
  usePersonData();

  // Update document title when data changes
  useEffect(() => {
    if (resumeData) {
      const title = `${resumeData.basics.name} - ${t('document.titleSuffix')}`;
      document.title = title;
    }
  }, [resumeData, t]);

  // Early returns after all hooks
  
  // If database is not configured show error
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

  // Main render with data. A JSON file loaded in edit mode takes the place of
  // the database copy until it is discarded.
  const data = preview?.data ?? resumeData;
  const workItems = groupWorkEntries(data.work);

  return (
    <div className="min-h-screen bg-gray-50 print:min-h-0 print:bg-white">
      <ActionBar />
      <PreviewDiff />
      <div className="resume-container shadow-lg print:shadow-none">
        <div className="section-spacing">
          <BasicInfo basics={data.basics} />
          <PersonalContact />
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