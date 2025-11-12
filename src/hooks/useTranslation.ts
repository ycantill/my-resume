import { useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t as translateFn } from '../resume-helpers';
import type { LocalizedText } from '../types';

/**
 * Custom hook for translations
 * Automatically uses the language from LanguageContext
 * 
 * @returns {Object} Object containing translation function and current language
 * @example
 * const { t } = useTranslation();
 * return <h1>{t('sections.education')}</h1>;
 */
export function useTranslation() {
  const { language } = useLanguage();
  
  // Memoize translation function with current language
  const t = useCallback(
    (textOrKey: LocalizedText | string) => {
      return translateFn(textOrKey, language);
    },
    [language]
  );
  
  return { t, language };
}
