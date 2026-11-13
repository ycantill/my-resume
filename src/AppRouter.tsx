import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import MyResume from './MyResume';
import { PdfDownloads } from './components/index.ts';
import type { AppRouterProps, Language } from './types';
import { isValidLanguage, SUPPORTED_LANGUAGES } from './types';

const AppRouter: React.FC<AppRouterProps> = () => {
  // Detect browser language for default
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) return 'es';
    return 'en'; // Default to English
  };

  const defaultLanguage = getBrowserLanguage();

  return (
    <Router>
      <Routes>
        {/* Default route - redirect to browser language */}
        <Route 
          path="/" 
          element={<Navigate to={`/${defaultLanguage}`} replace />} 
        />

        {/* Language-only route - shows resume with the default location */}
        <Route
          path="/:language"
          element={<LanguageRoute />}
        />

        {/* Generated PDFs of every version, in the browser language: #downloads */}
        <Route
          path="/downloads"
          element={<PdfDownloads initialLanguage={defaultLanguage} />}
        />

        {/* Former address of the downloads page */}
        <Route
          path="/:language/pdfs"
          element={<Navigate to="/downloads" replace />}
        />

        {/* Language + location route, e.g. #/en/colombia, #/en/spain */}
        <Route
          path="/:language/:location"
          element={<LanguageRoute />}
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


// Component that handles /:language and /:language/:location routes
const LanguageRoute: React.FC = () => {
  const { language, location } = useParams<{ language: string; location?: string }>();

  // Validate language
  if (!language || !isValidLanguage(language)) {
    const defaultLanguage = SUPPORTED_LANGUAGES[0];
    return <Navigate to={`/${defaultLanguage}`} replace />;
  }

  const validatedLanguage = language as Language;

  return <MyResume initialLanguage={validatedLanguage} initialLocation={location} />;
};

export default AppRouter;