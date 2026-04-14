// src/database/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoDJfmEbhDEy3GlFIQBHFZXlu0ESuwScg",
  authDomain: "g-pim-a00b9.firebaseapp.com",
  projectId: "g-pim-a00b9",
  storageBucket: "g-pim-a00b9.firebasestorage.app",
  messagingSenderId: "631411462533",
  appId: "1:631411462533:web:355971118d96639c1fb4ec",
  measurementId: "G-7C65L6QNB8"
};

// Inicializamos la App
const app = initializeApp(firebaseConfig);

// Exportamos las instancias para usarlas en los Hooks (ViewModels)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;