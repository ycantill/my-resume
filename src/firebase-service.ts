import { ref, get, onValue, off } from 'firebase/database';
import { database } from './firebase-config.ts';
import { useState, useEffect, useCallback } from 'react';
import type { ResumeData, UsePersonaDataResult, ResumeDataError } from './types.ts';

/**
 * Obtiene los datos de una persona desde Realtime Database
 * @param personaId - ID de la persona ('yohany' o 'lenicet')
 * @returns Datos de la persona o null si no existe
 */
export async function getPersonaData(personaId: string): Promise<ResumeData | null> {
  try {
    const personaRef = ref(database, `personas/${personaId}`);
    const snapshot = await get(personaRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    console.log('No se encontró documento para:', personaId);
    return null;
  } catch (error) {
    console.error('Error obteniendo datos de persona:', error);
    return null;
  }
}

/**
 * Cache para evitar múltiples llamadas a Firebase
 */
const cache = new Map<string, ResumeData>();

/**
 * Hook personalizado para obtener datos de una persona en tiempo real
 * @param personaId - ID de la persona
 * @returns { data, loading, error, refetch }
 */
export function usePersonaData(personaId: string): UsePersonaDataResult {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ResumeDataError | null>(null);

  useEffect(() => {
    if (!personaId) {
      setData(null);
      setLoading(false);
      setError({
        code: 'INVALID_DATA',
        message: 'No persona ID provided'
      });
      return;
    }

    setLoading(true);
    setError(null);

    const personaRef = ref(database, `personas/${personaId}`);
    
    const unsubscribe = onValue(
      personaRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const personaData = snapshot.val();
          // Actualizar cache
          cache.set(personaId, personaData);
          setData(personaData);
          setError(null);
        } else {
          setData(null);
          setError({
            code: 'PERSONA_NOT_FOUND',
            message: `No se encontraron datos para la persona: ${personaId}`,
            personaId
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error cargando desde Firebase:', error);
        setError({
          code: 'FIREBASE_ERROR',
          message: `Error al cargar currículum: ${error.message}`,
          personaId,
          originalError: error
        });
        setLoading(false);
      }
    );

    // Cleanup function
    return () => off(personaRef, 'value', unsubscribe);
  }, [personaId]);

  const refetch = useCallback(async () => {
    if (!personaId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Limpiar cache para esta persona
      cache.delete(personaId);
      const newData = await getPersonaData(personaId);
      if (newData) {
        setData(newData);
        cache.set(personaId, newData);
      } else {
        setError({
          code: 'PERSONA_NOT_FOUND',
          message: `No se encontraron datos para la persona: ${personaId}`,
          personaId
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError({
        code: 'NETWORK_ERROR',
        message: `Error al cargar currículum: ${errorMessage}`,
        personaId,
        originalError: err instanceof Error ? err : undefined
      });
    } finally {
      setLoading(false);
    }
  }, [personaId]);

  return { data, loading, error, refetch };
}