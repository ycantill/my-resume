// Types for the resume data structure based on actual Firebase data
import { ReactNode } from 'react';

export type Language = 'en' | 'es';

export interface LocalizedText {
  en: string;
  es: string;
}

export interface LocalizedHighlights {
  en: string[];
  es: string[];
}

export interface BasicLocation {
  city?: string;
  region?: LocalizedText;
  country?: LocalizedText;
  countryCode?: string;
}

export interface PersonalInfo {
  email: string;
  phone: string;
  location: BasicLocation;
}

export interface ContactProfile {
  network: string;
  url: string;
  username: string;
}

export interface ResumeBasics {
  name: string;
  label: LocalizedText;
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

export interface WorkRole {
  position: LocalizedText;
  startDate: string;
  endDate?: string;
  location: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedHighlights;
  stack?: string[];
}

export interface GroupedWorkEntry {
  name: string;
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
  level: LocalizedText;
  keywords: string[];
}

export interface ResumeData {
  name: string;              // Person identifier
  basics: ResumeBasics;
  work: WorkEntry[];
  education: Education[];
  languages: LanguageEntry[];
  skills: Skill[];
}

export interface UsePersonDataResult {
  data: ResumeData | null;
  loading: boolean;
  error: ResumeDataError | null;
  refetch: () => Promise<void>;
}

export interface MyResumeProps {
  initialPerson?: string;
}

// Router-related types
export interface AppRouterProps {
  // Optional initial person from VITE_PERSON env variable
  initialPerson?: string;
}

// Language Context types
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

// Firebase specific types
export interface FirebasePeopleData {
  people: ResumeData[];      // Changed: now it's an array instead of object
}

// Utility types for component props
export interface DateRange {
  startDate: string;
  endDate?: string;
}

export interface LocationDisplayProps {
  location: BasicLocation;
  language: Language;
}

// Component props interfaces - language obtained from useTranslation hook
export interface BasicInfoProps {
  basics: ResumeBasics;
}

export interface PersonalContactProps {
  personal: PersonalInfo;
}

export interface SummaryProps {
  summary: LocalizedText;
}

export interface WorkExperienceProps {
  workItems: (WorkEntry | GroupedWorkEntry)[];
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
// because they render outside LanguageProvider
export interface LoadingStateProps {
  language: Language;
}

export interface ErrorStateProps {
  error: ResumeDataError | null;
  language: Language;
}

// Skill level type for better type safety
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillLevelLocalized = {
  en: SkillLevel;
  es: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
};

// Language fluency type for better type safety
export type LanguageFluency = 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
export type LanguageFluencyLocalized = {
  en: LanguageFluency;
  es: 'Nativo' | 'Fluido' | 'Avanzado' | 'Intermedio' | 'Básico';
};

// Country codes type for better validation
export type CountryCode = 'CO' | 'ES' | 'US' | 'CA' | 'MX' | 'AR' | 'BR' | 'CL' | 'PE' | 'EC';

// Network types for social profiles
export type SocialNetwork = 'LinkedIn' | 'GitHub' | 'Twitter' | 'Website' | 'Portfolio';

// Available persons type
export type PersonId = 'yohany' | 'lenicet';

// Date format type (YYYY-MM)
export type DateString = `${number}-${string}`;

// Enhanced interfaces with more specific types
export interface EnhancedContactProfile extends ContactProfile {
  network: SocialNetwork;
}

export interface EnhancedBasicLocation extends BasicLocation {
  countryCode?: CountryCode;
}

// Type guards for runtime validation
export const isValidLanguage = (lang: string): lang is Language => {
  return lang === 'en' || lang === 'es';
};

export const isValidPersonId = (id: string): id is PersonId => {
  return id === 'yohany' || id === 'lenicet';
};

// Constants for better type safety
export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'es'] as const;
export const SUPPORTED_PERSONS: readonly PersonId[] = ['yohany', 'lenicet'] as const;

// Error types for better error handling
export interface ResumeDataError {
  code: 'PERSON_NOT_FOUND' | 'FIREBASE_ERROR' | 'NETWORK_ERROR' | 'INVALID_DATA';
  message: string;
  personId?: string;
  originalError?: Error;
}

/**
 * Formats error message for display based on language
 */
export const formatErrorMessage = (error: ResumeDataError, language: Language): string => {
  const messages = {
    PERSON_NOT_FOUND: {
      en: `Person not found: ${error.personId || 'unknown'}`,
      es: `Persona no encontrada: ${error.personId || 'desconocida'}`
    },
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
    }
  };
  
  return messages[error.code]?.[language] || error.message;
};