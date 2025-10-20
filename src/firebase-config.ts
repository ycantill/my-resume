import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Tu configuración de Firebase (obtenla de la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyB40xZG9S-2abcMC3jmGzqEt61DwhOYEtw",
  authDomain: "my-resume-1a1ca.firebaseapp.com",
  databaseURL: "https://my-resume-1a1ca-default-rtdb.firebaseio.com",
  projectId: "my-resume-1a1ca",
  storageBucket: "my-resume-1a1ca.firebasestorage.app",
  messagingSenderId: "407313525537",
  appId: "1:407313525537:web:fecd46b30ec6944c236c60",
  measurementId: "G-VPF69NL9JG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Realtime Database
export const database = getDatabase(app);

export default app;