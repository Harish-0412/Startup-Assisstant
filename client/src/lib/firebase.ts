import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBRhTc7Jj8ozLO7srZbm2K2XVdqhL9yEms",
  authDomain: "startup-hub-chat.firebaseapp.com",
  projectId: "startup-hub-chat",
  storageBucket: "startup-hub-chat.firebasestorage.app",
  messagingSenderId: "402825051598",
  appId: "1:402825051598:web:237a1aae49d9fe7a53ff9f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();