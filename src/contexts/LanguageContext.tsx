import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, LanguageContextType, LanguageProviderProps } from '../types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  initialLanguage = 'es' 
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // Sync language state when initialLanguage prop changes (URL change)
  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};