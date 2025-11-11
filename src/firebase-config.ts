import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Configuración de Firebase desde una única variable de entorno (JSON string)
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;

let app: FirebaseApp | null = null;
let database: Database | null = null;

// Solo inicializar si la configuración existe
if (firebaseConfigString) {
  try {
    // Parse de la configuración
    const firebaseConfig = JSON.parse(firebaseConfigString);
    
    // Inicializar Firebase
    app = initializeApp(firebaseConfig);
    
    // Inicializar Realtime Database
    database = getDatabase(app);
  } catch (error) {
    console.error('Error parsing Firebase configuration:', error);
  }
}

// Exportar database (puede ser null si no está configurado)
export { database };

// Exportar función para verificar si Firebase está configurado
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfigString !== undefined && firebaseConfigString !== '';
};

export default app;