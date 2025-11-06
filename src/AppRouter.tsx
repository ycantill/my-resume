import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import MyResume from './MyResume';
import type { AppRouterProps, PersonId, Language } from './types';
import { isValidPersonId, isValidLanguage, SUPPORTED_PERSONS, SUPPORTED_LANGUAGES } from './types';

const AppRouter: React.FC<AppRouterProps> = () => {
  // Detect basename based on environment
  const basename = import.meta.env.PROD ? '/my-resume' : '';

  // Detect browser language for default
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) return 'es';
    return 'en'; // Default to English
  };

  const defaultLanguage = getBrowserLanguage();
  const defaultPerson = SUPPORTED_PERSONS[0];

  return (
    <Router basename={basename}>
      <Routes>
        {/* Default route - redirect to browser language and first person */}
        <Route 
          path="/" 
          element={<Navigate to={`/${defaultLanguage}/${defaultPerson}`} replace />} 
        />
        
        {/* Language + Person routes */}
        <Route 
          path="/:language/:personId" 
          element={<LanguagePersonRoute />} 
        />
        
        {/* Legacy person-only routes - redirect to default language */}
        <Route 
          path="/:personId" 
          element={<LegacyPersonRoute />} 
        />
        
        {/* Catch all - redirect to default */}
        <Route 
          path="*" 
          element={<Navigate to={`/${defaultLanguage}/${defaultPerson}`} replace />} 
        />
      </Routes>
    </Router>
  );
};

// Component that handles language + person route validation
const LanguagePersonRoute: React.FC = () => {
  const { language, personId } = useParams<{ language: string; personId: string }>();
  
  // Validate language and personId
  if (!language || !isValidLanguage(language) || !personId || !isValidPersonId(personId)) {
    const defaultLanguage = SUPPORTED_LANGUAGES[0];
    const defaultPerson = SUPPORTED_PERSONS[0];
    return <Navigate to={`/${defaultLanguage}/${defaultPerson}`} replace />;
  }
  
  return (
    <LanguageProvider initialLanguage={language as Language}>
      <MyResume initialPerson={personId as PersonId} initialLanguage={language as Language} />
    </LanguageProvider>
  );
};

// Component that handles legacy person-only routes
const LegacyPersonRoute: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  
  // Validate personId and redirect to default language
  if (!personId || !isValidPersonId(personId)) {
    const defaultLanguage = SUPPORTED_LANGUAGES[0];
    const defaultPerson = SUPPORTED_PERSONS[0];
    return <Navigate to={`/${defaultLanguage}/${defaultPerson}`} replace />;
  }
  
  const defaultLanguage = SUPPORTED_LANGUAGES[0];
  return <Navigate to={`/${defaultLanguage}/${personId}`} replace />;
};

export default AppRouter;