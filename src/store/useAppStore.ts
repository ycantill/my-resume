import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Language, ResumeData, PersonalInfo, ResumeDataError } from '../types';

interface AppState {
  // Estado
  language: Language;
  resumeData: ResumeData | null;
  contactData: PersonalInfo | null;
  loading: boolean;
  error: ResumeDataError | null;
  
  // Acciones
  setLanguage: (language: Language) => void;
  setResumeData: (data: ResumeData | null) => void;
  setContactData: (data: PersonalInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: ResumeDataError | null) => void;
  reset: () => void;
}

const initialState = {
  language: 'en' as Language,
  resumeData: null,
  contactData: null,
  loading: false,
  error: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setLanguage: (language) => set({ language }),
      setResumeData: (data) => set({ resumeData: data }),
      setContactData: (data) => set({ contactData: data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    { name: 'AppStore' }
  )
);

// Selectores para optimizar re-renders
export const selectLanguage = (state: AppState) => state.language;
export const selectResumeData = (state: AppState) => state.resumeData;
export const selectContactData = (state: AppState) => state.contactData;
export const selectLoading = (state: AppState) => state.loading;
export const selectError = (state: AppState) => state.error;
