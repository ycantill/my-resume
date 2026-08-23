import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Language, ResumeData, PersonalInfo, ResumeDataError, SaveState } from '../types';

interface AppState {
  // Estado
  language: Language;
  locationSlug: string | null;
  resumeData: ResumeData | null;
  contactData: PersonalInfo | null;
  loading: boolean;
  error: ResumeDataError | null;
  authToken: string | null;
  editMode: boolean;
  saveState: SaveState;
  saveError: string | null;

  // Acciones
  setLanguage: (language: Language) => void;
  setLocationSlug: (locationSlug: string | null) => void;
  setResumeData: (data: ResumeData | null) => void;
  setResumeSection: <K extends keyof ResumeData>(section: K, value: ResumeData[K]) => void;
  setContactData: (data: PersonalInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: ResumeDataError | null) => void;
  setAuthToken: (token: string | null) => void;
  setEditMode: (editMode: boolean) => void;
  setSaveState: (saveState: SaveState, saveError?: string | null) => void;
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
  editMode: false,
  saveState: 'idle' as SaveState,
  saveError: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setLanguage: (language) => set({ language }),
      setLocationSlug: (locationSlug) => set({ locationSlug }),
      setResumeData: (data) => set({ resumeData: data }),
      setResumeSection: (section, value) =>
        set((state) =>
          state.resumeData ? { resumeData: { ...state.resumeData, [section]: value } } : {}
        ),
      setContactData: (data) => set({ contactData: data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setAuthToken: (token) => set({ authToken: token }),
      setEditMode: (editMode) => set({ editMode, saveState: 'idle', saveError: null }),
      setSaveState: (saveState, saveError = null) => set({ saveState, saveError }),
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
export const selectEditMode = (state: AppState) => state.editMode;
export const selectSaveState = (state: AppState) => state.saveState;
export const selectSaveError = (state: AppState) => state.saveError;
