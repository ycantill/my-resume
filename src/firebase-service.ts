import { ref, get, onValue, off } from 'firebase/database';
import { database } from './firebase-config.ts';
import { useState, useEffect, useCallback } from 'react';
import type { ResumeData, UsePersonDataResult, ResumeDataError, PersonalInfo } from './types.ts';

/**
 * Obtiene los datos de una persona desde Realtime Database (solo datos públicos)
 * @param personId - ID de la persona ('yohany' o 'lenicet')
 * @returns Datos de la persona o null si no existe
 */
export async function getPersonData(personId: string): Promise<ResumeData | null> {
  try {
    const peopleRef = ref(database, 'public/people');
    const snapshot = await get(peopleRef);
    
    if (snapshot.exists()) {
      const people = snapshot.val();
      const person = people.find((p: ResumeData) => p.name === personId);
      return person || null;
    }
    console.log('No se encontró documento para:', personId);
    return null;
  } catch (error) {
    console.error('Error obteniendo datos de persona:', error);
    return null;
  }
}

/**
 * Obtiene los datos de contacto privados de una persona (requiere VITE_SHOW_PRIVATE_INFO)
 * @param personId - ID de la persona ('yohany' o 'lenicet')
 * @returns Datos de contacto privados o null si no existe
 */
export async function getPersonContactData(personId: string): Promise<PersonalInfo | null> {
  try {
    const contactRef = ref(database, 'private/contact');
    const snapshot = await get(contactRef);
    
    if (snapshot.exists()) {
      const contacts = snapshot.val();
      const contact = contacts.find((c: any) => c.name === personId);
      if (contact) {
        // Extraer solo los datos de contacto, sin el campo 'name'
        const { name, ...personalInfo } = contact;
        return personalInfo as PersonalInfo;
      }
      return null;
    }
    console.log('No se encontró información de contacto para:', personId);
    return null;
  } catch (error) {
    console.error('Error obteniendo datos de contacto:', error);
    return null;
  }
}

/**
 * Cache para evitar múltiples llamadas a Firebase
 */
const cache = new Map<string, ResumeData>();

/**
 * Hook personalizado para obtener datos de una persona en tiempo real
 * @param personId - ID de la persona
 * @returns Objeto con datos, estado de carga y errores
 */
export function usePersonData(personId: string): UsePersonDataResult {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ResumeDataError | null>(null);

  useEffect(() => {
    if (!personId) {
      setData(null);
      setLoading(false);
      setError({
        code: 'INVALID_DATA',
        message: 'No person ID provided'
      });
      return;
    }

    setLoading(true);
    setError(null);

    const peopleRef = ref(database, 'public/people');
    
    const unsubscribe = onValue(
      peopleRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const people = snapshot.val();
          const person = people.find((p: ResumeData) => p.name === personId);
          
          if (person) {
            // Actualizar cache
            cache.set(personId, person);
            setData(person);
            setError(null);
          } else {
            setData(null);
            setError({
              code: 'PERSON_NOT_FOUND',
              message: `No se encontraron datos para la persona: ${personId}`,
              personId
            });
          }
        } else {
          setData(null);
          setError({
            code: 'PERSON_NOT_FOUND',
            message: `No se encontraron datos para la persona: ${personId}`,
            personId
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error cargando desde Firebase:', error);
        setError({
          code: 'FIREBASE_ERROR',
          message: `Error al cargar currículum: ${error.message}`,
          personId,
          originalError: error
        });
        setLoading(false);
      }
    );

    // Cleanup function
    return () => off(peopleRef, 'value', unsubscribe);
  }, [personId]);

  const refetch = useCallback(async () => {
    if (!personId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Limpiar cache para esta persona
      cache.delete(personId);
      const newData = await getPersonData(personId);
      if (newData) {
        setData(newData);
        cache.set(personId, newData);
      } else {
        setError({
          code: 'PERSON_NOT_FOUND',
          message: `No se encontraron datos para la persona: ${personId}`,
          personId
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError({
        code: 'NETWORK_ERROR',
        message: `Error al cargar currículum: ${errorMessage}`,
        personId,
        originalError: err instanceof Error ? err : undefined
      });
    } finally {
      setLoading(false);
    }
  }, [personId]);

  return { data, loading, error, refetch };
}