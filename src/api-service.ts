import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { getFreshIdToken } from './firebase-auth';
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
  
  return normalizeResumeData(data);
}

/**
 * Fill in the sections Firebase leaves out.
 *
 * A Realtime Database node with no children does not exist, so a section the
 * editor empties comes back missing rather than as [], and a list whose keys
 * are not contiguous comes back with null holes. Both would crash the render.
 */
function normalizeResumeData(data: Record<string, unknown>): ResumeData {
  const list = <T,>(value: unknown): T[] =>
    Array.isArray(value) ? (value.filter(Boolean) as T[]) : [];

  const basics = (data.basics ?? {}) as ResumeData['basics'];

  return {
    ...(data as object),
    basics: { ...basics, profiles: list(basics.profiles) },
    work: list(data.work),
    education: list(data.education),
    languages: list(data.languages),
    skills: list(data.skills),
  } as ResumeData;
}

/**
 * Fetch contact data from Firebase REST API
 * Data is stored directly under /private (single person)
 */
async function fetchPersonContactData(authToken: string): Promise<PersonalInfo | null> {
  const baseUrl = getDatabaseUrl();
  const url = `${baseUrl}/private.json?auth=${authToken}`;
  
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
 * Get contact data using a Firebase auth token
 */
export async function getPersonContactData(authToken: string): Promise<PersonalInfo | null> {
  try {
    return await fetchPersonContactData(authToken);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return null;
  }
}

/**
 * Write a single resume section back to /public
 *
 * Uses PATCH so the other sections are left untouched; Firebase replaces the
 * named child wholesale, so removing an item from the JSON removes it for real.
 * Writes are rejected by the database rules unless the signed-in user owns the resume.
 */
export async function saveResumeSection<K extends keyof ResumeData>(
  section: K,
  value: ResumeData[K]
): Promise<void> {
  const authToken = await getFreshIdToken();

  if (!authToken) {
    throw new Error('You must be signed in to save changes');
  }

  const baseUrl = getDatabaseUrl();
  const url = `${baseUrl}/public.json?auth=${authToken}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [section]: value }),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Not authorized to write. Check the database rules for /public.');
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
}
