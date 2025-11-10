import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import MyResume from './MyResume';
import { PersonRequiredFallback } from './components/index';
import type { AppRouterProps, PersonId, Language } from './types';
import { isValidPersonId, isValidLanguage, SUPPORTED_LANGUAGES } from './types';

const AppRouter: React.FC<AppRouterProps> = ({ initialPerson }) => {
  // Detect basename based on environment
  const basename = import.meta.env.PROD ? '/my-resume' : '';

  // Detect browser language for default
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) return 'es';
    return 'en'; // Default to English
  };

  const defaultLanguage = getBrowserLanguage();
  
  // Check if initialPerson is provided and valid
  const hasValidPerson = initialPerson && isValidPersonId(initialPerson);
  const validatedPerson = hasValidPerson ? initialPerson as PersonId : null;

  // Handle GitHub Pages routing - check if there's a stored route from 404.html
  React.useEffect(() => {
    const storedRoute = sessionStorage.getItem('github-pages-route');
    if (storedRoute) {
      sessionStorage.removeItem('github-pages-route');
      // Only redirect if it's a valid language route
      if (storedRoute === 'es' || storedRoute === 'en') {
        window.location.replace(`${basename}/${storedRoute}`);
      }
    }
  }, [basename]);

  return (
    <Router basename={basename}>
      <Routes>
        {/* Default route - redirect to browser language */}
        <Route 
          path="/" 
          element={<Navigate to={`/${defaultLanguage}`} replace />} 
        />

        {/* Language-only route - shows resume if person is provided, fallback otherwise */}
        <Route 
          path="/:language" 
          element={<LanguageRoute initialPerson={validatedPerson} />} 
        />

        {/* Catch all - redirect to default language */}
        <Route 
          path="*" 
          element={<Navigate to={`/${defaultLanguage}`} replace />} 
        />
      </Routes>
    </Router>
  );
};


// Component that handles language-only routes and shows resume or fallback
const LanguageRoute: React.FC<{ initialPerson: PersonId | null }> = ({ initialPerson }) => {
  const { language } = useParams<{ language: string }>();

  // Validate language
  if (!language || !isValidLanguage(language)) {
    const defaultLanguage = SUPPORTED_LANGUAGES[0];
    return <Navigate to={`/${defaultLanguage}`} replace />;
  }

  const validatedLanguage = language as Language;

  // If no person is provided, show the fallback page
  if (!initialPerson) {
    return <PersonRequiredFallback language={validatedLanguage} />;
  }

  // Show the resume with the provided person
  return (
    <LanguageProvider initialLanguage={validatedLanguage}>
      <MyResume initialPerson={initialPerson} initialLanguage={validatedLanguage} />
    </LanguageProvider>
  );
};

export default AppRouter;