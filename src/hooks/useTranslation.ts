import { useCallback } from 'react';
import { useAppStore, selectLanguage } from '../store/useAppStore';
import { t as translateFn } from '../resume-helpers';
import type { LocalizedText } from '../types';

/**
 * Custom hook for translations
 * Uses the language from Zustand store
 * 
 * @returns {Object} Object containing translation function, current language, and setLanguage
 * @example
 * const { t, language } = useTranslation();
 * return <h1>{t('sections.education')}</h1>;
 */
export function useTranslation() {
  const language = useAppStore(selectLanguage);
  const setLanguage = useAppStore(state => state.setLanguage);
  
  // Memoize translation function with current language
  const t = useCallback(
    (textOrKey: LocalizedText | string) => {
      return translateFn(textOrKey, language);
    },
    [language]
  );
  
  return { t, language, setLanguage };
}
