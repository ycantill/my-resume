import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import type { ResumeData, PersonalInfo, ResumeDataError } from './types';

/**
 * Get Firebase Database URL from environment variables
 */
function getDatabaseUrl(): string {
  const url = import.meta.env.VITE_DATABASE_URL;
  if (!url) {
    throw new Error('VITE_DATABASE_URL environment variable is not defined');
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Check if database URL is configured
 */
export function isDatabaseConfigured(): boolean {
  return !!import.meta.env.VITE_DATABASE_URL;
}

/**
 * Fetch resume data from Firebase REST API
 * Data is stored directly under /public (single person)
 */
async function fetchPersonData(): Promise<ResumeData> {
  const baseUrl = getDatabaseUrl();
  const url = `${baseUrl}/public.json`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Resume data not found in database`);
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data || typeof data !== 'object') {
    throw new Error(`Invalid data structure in database`);
  }
  
  return data as ResumeData;
}

/**
 * Fetch contact data from Firebase REST API
 * Data is stored directly under /private (single person)
 */
async function fetchPersonContactData(): Promise<PersonalInfo | null> {
  const baseUrl = getDatabaseUrl();
  const url = `${baseUrl}/private.json`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Private data not found is OK
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contactData = await response.json();
    
    if (!contactData || typeof contactData !== 'object') {
      return null;
    }
    
    return contactData as PersonalInfo;
  } catch (error) {
    console.warn('Failed to fetch private contact data:', error);
    return null;
  }
}

/**
 * Hook to fetch resume data from Firebase REST API
 * Integrates with Zustand store for state management
 */
export function usePersonData() {
  const setResumeData = useAppStore(state => state.setResumeData);
  const setLoading = useAppStore(state => state.setLoading);
  const setError = useAppStore(state => state.setError);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resumeData = await fetchPersonData();
        
        if (!cancelled) {
          setResumeData(resumeData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const errorObj: ResumeDataError = {
            code: 'FETCH_ERROR',
            message: err instanceof Error ? err.message : 'Unknown error occurred',
          };
          setError(errorObj);
          setResumeData(null);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [setResumeData, setLoading, setError]);
}

/**
 * Get contact data (async function)
 */
export async function getPersonContactData(): Promise<PersonalInfo | null> {
  try {
    return await fetchPersonContactData();
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return null;
  }
}
