// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoDJfmEbhDEy3GlFIQBHFZXlu0ESuwScg",
  authDomain: "g-pim-a00b9.firebaseapp.com",
  projectId: "g-pim-a00b9",
  storageBucket: "g-pim-a00b9.firebasestorage.app",
  messagingSenderId: "631411462533",
  appId: "1:631411462533:web:355971118d96639c1fb4ec",
  measurementId: "G-7C65L6QNB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios (Auth y Base de datos) para usarlos en el resto de la app
export const auth = getAuth(app);
export const db = getFirestore(app)