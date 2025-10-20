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

export interface BasicLocation {
  city?: string;
  region?: LocalizedText;
  country?: LocalizedText;
  countryCode?: string;
  phone?: string;
}

export interface ContactProfile {
  network: string;
  url: string;
  username: string;
}

export interface ResumeBasics {
  name: string;
  label: LocalizedText;
  email: string;
  summary: LocalizedText;
  location: BasicLocation;
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
  basics: ResumeBasics;
  work: WorkEntry[];
  education: Education[];
  languages: LanguageEntry[];
  skills: Skill[];
}

export interface UsePersonaDataResult {
  data: ResumeData | null;
  loading: boolean;
  error: ResumeDataError | null;
  refetch: () => Promise<void>;
}

export interface MyResumeProps {
  initialLang?: Language;
  initialPersona?: string;
}

// Firebase specific types
export interface FirebasePersonasData {
  personas: {
    [personaId: string]: ResumeData;
  };
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

// Available personas type
export type PersonaId = 'yohany' | 'lenicet';

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

export const isValidPersonaId = (id: string): id is PersonaId => {
  return id === 'yohany' || id === 'lenicet';
};

// Constants for better type safety
export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'es'] as const;
export const SUPPORTED_PERSONAS: readonly PersonaId[] = ['yohany', 'lenicet'] as const;

// Error types for better error handling
export interface ResumeDataError {
  code: 'PERSONA_NOT_FOUND' | 'FIREBASE_ERROR' | 'NETWORK_ERROR' | 'INVALID_DATA';
  message: string;
  personaId?: string;
  originalError?: Error;
}

/**
 * Formats error message for display based on language
 */
export const formatErrorMessage = (error: ResumeDataError, language: Language): string => {
  const messages = {
    PERSONA_NOT_FOUND: {
      en: `Person not found: ${error.personaId || 'unknown'}`,
      es: `Persona no encontrada: ${error.personaId || 'desconocida'}`
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