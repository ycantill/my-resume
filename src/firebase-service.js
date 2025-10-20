import { ref, get, set, onValue, off } from 'firebase/database';
import { database } from './firebase-config.js';
import { useState, useEffect, useCallback } from 'react';

/**
 * Obtiene los datos de una persona desde Realtime Database
 * @param {string} personaId - ID de la persona ('yohany' o 'lenicet')
 * @returns {Promise<Object|null>} - Datos de la persona o null si no existe
 */
export async function getPersonaData(personaId) {
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
 * Guarda los datos de una persona en Realtime Database
 * @param {string} personaId - ID de la persona
 * @param {Object} data - Datos de la persona
 * @returns {Promise<boolean>} - true si se guardó correctamente
 */
export async function setPersonaData(personaId, data) {
  try {
    const personaRef = ref(database, `personas/${personaId}`);
    await set(personaRef, data);
    return true;
  } catch (error) {
    console.error('Error guardando datos de persona:', error);
    return false;
  }
}

/**
 * Obtiene todas las personas disponibles
 * @returns {Promise<Array>} - Lista de personas
 */
export async function getAllPersonas() {
  try {
    const personasRef = ref(database, 'personas');
    const snapshot = await get(personasRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error obteniendo todas las personas:', error);
    return [];
  }
}

/**
 * Cache para evitar múltiples llamadas a Firebase
 */
const cache = new Map();

/**
 * Obtiene datos con cache
 * @param {string} personaId 
 * @returns {Promise<Object|null>}
 */
export async function getPersonaDataCached(personaId) {
  if (cache.has(personaId)) {
    return cache.get(personaId);
  }
  
  const data = await getPersonaData(personaId);
  if (data) {
    cache.set(personaId, data);
  }
  
  return data;
}

/**
 * Limpia el cache
 */
export function clearCache() {
  cache.clear();
}

/**
 * Hook personalizado para obtener datos de una persona en tiempo real
 * @param {string} personaId - ID de la persona
 * @returns {Object} - { data, loading, error }
 */
export function usePersonaData(personaId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!personaId) {
      setData(null);
      setLoading(false);
      setError('No persona ID provided');
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
          setError(`No se encontraron datos para la persona: ${personaId}`);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error cargando desde Firebase:', error);
        setError(`Error al cargar currículum: ${error.message}`);
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
        setError(`No se encontraron datos para la persona: ${personaId}`);
      }
    } catch (err) {
      setError(`Error al cargar currículum: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [personaId]);

  return { data, loading, error, refetch };
}