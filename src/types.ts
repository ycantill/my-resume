// Types for the resume data structure based on actual Firebase data

export type Language = 'en' | 'es';

export interface LocalizedText {
  en: string;
  es: string;
}

export interface LocalizedHighlights {
  en: string[];
  es: string[];
}

export interface LocationInfo {
  en: string;
  es: string;
  phone?: string;
}

export interface PersonalInfo {
  email: string;
  locations: LocationInfo[];
}

export interface ContactProfile {
  network: string;
  url: string;
  username: string;
}

export interface ResumeBasics {
  name: string;
  label: LocalizedText;
  email?: string;
  summary: LocalizedText;
  profiles: ContactProfile[];
}

export interface WorkEntry {
  name: string;
  position: LocalizedText;
  startDate: string;
  endDate?: string;
  location: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedHighlights;
  stack?: string[];
}

// Address of an editable role within ResumeData['work']: a top-level entry,
// or a role nested inside a company that stores several of them
export interface WorkPath {
  entry: number;
  role?: number;
}

export interface WorkRole {
  // Where this role came from, so the inline editor can write back through
  // the regrouping done for display
  sourcePath?: WorkPath;
  position: LocalizedText;
  startDate: string;
  endDate?: string;
  location: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedHighlights;
  stack?: string[];
}

// A company that stores its roles nested, as opposed to one flat entry per role.
// Both shapes live side by side in the database.
export interface WorkGroupEntry {
  name: string;
  roles: WorkRole[];
}

export type WorkItem = WorkEntry | WorkGroupEntry;

export interface GroupedWorkEntry {
  name: string;
  // Every entry this company covers, so renaming it moves them together
  sourcePath?: WorkPath;
  sourcePaths?: WorkPath[];
  // For grouped entries (multiple roles at same company)
  roles?: WorkRole[];
  // For single entries (single role at company)  
  position?: LocalizedText;
  startDate?: string;
  endDate?: string;
  location?: LocalizedText;
  summary?: LocalizedText;
  highlights?: LocalizedHighlights;
  stack?: string[];
}

export interface Education {
  institution: string;
  studyType: LocalizedText;
  area: LocalizedText;
  location: string;
  startDate?: string;
  endDate?: string;
}

export interface LanguageEntry {
  language: LocalizedText;
  fluency: LocalizedText;
}

export interface Skill {
  name: string;
  level?: LocalizedText; // Optional for backward compatibility
  keywords: string[];
}

export interface ResumeData {
  basics: ResumeBasics;
  work: WorkItem[];
  education: Education[];
  languages: LanguageEntry[];
  skills: Skill[];
}

export interface MyResumeProps {
  initialLanguage: Language;
  initialLocation?: string;
}

// Inline editor save lifecycle, surfaced in the action bar
export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// Router-related types
export interface AppRouterProps {}

// Utility types for component props
export interface DateRange {
  startDate: string;
  endDate?: string;
}

// Component props interfaces - language obtained from useTranslation hook
export interface BasicInfoProps {
  basics: ResumeBasics;
}

export type PersonalContactProps = Record<string, never>;

export interface SummaryProps {
  summary: LocalizedText;
}

export interface WorkExperienceProps {
  workItems: GroupedWorkEntry[];
}

export interface EducationSectionProps {
  education: Education[];
}

export interface LanguagesProps {
  languages: LanguageEntry[];
}

export interface SkillsProps {
  skills: Skill[];
}

// Loading and Error component props - these receive language directly
// because they render before the store is initialized
export interface LoadingStateProps {
  language: Language;
}

export interface ErrorStateProps {
  error: ResumeDataError | null;
  language: Language;
}

// Type guards for runtime validation
export const isValidLanguage = (lang: string): lang is Language => {
  return lang === 'en' || lang === 'es';
};

// Removed isValidPersonId - any person ID is now valid

// Constants for better type safety
export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'es'] as const;

// Removed SUPPORTED_PERSONS - any person can be used

// Error types for better error handling
export interface ResumeDataError {
  code: 'FIREBASE_ERROR' | 'NETWORK_ERROR' | 'INVALID_DATA' | 'FETCH_ERROR';
  message: string;
  originalError?: Error;
}

/**
 * Formats error message for display based on language
 */
export const formatErrorMessage = (error: ResumeDataError, language: Language): string => {
  const messages = {
    FIREBASE_ERROR: {
      en: 'Firebase connection error. Please check your internet connection.',
      es: 'Error de conexión a Firebase. Por favor verifica tu conexión a internet.'
    },
    NETWORK_ERROR: {
      en: 'Network error. Please try again later.',
      es: 'Error de red. Por favor intenta de nuevo más tarde.'
    },
    INVALID_DATA: {
      en: 'Invalid data provided.',
      es: 'Datos inválidos proporcionados.'
    },
    FETCH_ERROR: {
      en: 'Error fetching data from database.',
      es: 'Error al obtener datos de la base de datos.'
    }
  };
  
  return messages[error.code]?.[language] || error.message;
};