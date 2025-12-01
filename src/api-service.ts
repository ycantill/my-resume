import { useState, useEffect } from 'react';
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
 * Fetch person data from Firebase REST API
 * Firebase stores people as an array, so we fetch all and find by name
 */
async function fetchPersonData(personId: string): Promise<ResumeData> {
  const baseUrl = getDatabaseUrl();
  const url = `${baseUrl}/public/people.json`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`People data not found in database`);
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const peopleArray = await response.json();
  
  if (!peopleArray || !Array.isArray(peopleArray)) {
    throw new Error(`Invalid people data structure in database`);
  }
  
  // Find person by name field
  const personData = peopleArray.find((person: any) => person?.name === personId);
  
  if (!personData) {
    throw new Error(`No data found for person '${personId}'`);
  }
  
  return personData as ResumeData;
}

/**
 * Fetch person contact data from Firebase REST API
 * Firebase stores contact as an array, so we fetch all and find by name
 */
async function fetchPersonContactData(personId: string): Promise<PersonalInfo | null> {
  const baseUrl = getDatabaseUrl();
  const url = `${baseUrl}/private/contact.json`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Private data not found is OK
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contactArray = await response.json();
    
    if (!contactArray || !Array.isArray(contactArray)) {
      return null;
    }
    
    // Find contact by name field
    const contactData = contactArray.find((contact: any) => contact?.name === personId);
    
    return contactData || null;
  } catch (error) {
    console.warn('Failed to fetch private contact data:', error);
    return null;
  }
}

/**
 * Hook to fetch person data from Firebase REST API
 */
export function usePersonData(personId: string | null) {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ResumeDataError | null>(null);

  useEffect(() => {
    if (!personId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resumeData = await fetchPersonData(personId);
        
        if (!cancelled) {
          setData(resumeData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const errorObj: ResumeDataError = {
            code: 'FETCH_ERROR',
            message: err instanceof Error ? err.message : 'Unknown error occurred',
            personId
          };
          setError(errorObj);
          setData(null);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  return { data, loading, error };
}

/**
 * Get person contact data (async function)
 */
export async function getPersonContactData(personId: string): Promise<PersonalInfo | null> {
  try {
    return await fetchPersonContactData(personId);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return null;
  }
}
