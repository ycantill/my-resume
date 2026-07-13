import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Language, ResumeData, PersonalInfo, ResumeDataError } from '../types';

interface AppState {
  // Estado
  language: Language;
  locationSlug: string | null;
  resumeData: ResumeData | null;
  contactData: PersonalInfo | null;
  loading: boolean;
  error: ResumeDataError | null;
  authToken: string | null;

  // Acciones
  setLanguage: (language: Language) => void;
  setLocationSlug: (locationSlug: string | null) => void;
  setResumeData: (data: ResumeData | null) => void;
  setContactData: (data: PersonalInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: ResumeDataError | null) => void;
  setAuthToken: (token: string | null) => void;
  reset: () => void;
}

const initialState = {
  language: 'en' as Language,
  locationSlug: null as string | null,
  resumeData: null,
  contactData: null,
  loading: false,
  error: null,
  authToken: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setLanguage: (language) => set({ language }),
      setLocationSlug: (locationSlug) => set({ locationSlug }),
      setResumeData: (data) => set({ resumeData: data }),
      setContactData: (data) => set({ contactData: data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setAuthToken: (token) => set({ authToken: token }),
      reset: () => set(initialState),
    }),
    { name: 'AppStore' }
  )
);

// Selectores para optimizar re-renders
export const selectLanguage = (state: AppState) => state.language;
export const selectLocationSlug = (state: AppState) => state.locationSlug;
export const selectResumeData = (state: AppState) => state.resumeData;
export const selectContactData = (state: AppState) => state.contactData;
export const selectLoading = (state: AppState) => state.loading;
export const selectError = (state: AppState) => state.error;
export const selectAuthToken = (state: AppState) => state.authToken;
