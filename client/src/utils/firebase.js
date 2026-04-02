import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interview-97142.firebaseapp.com",
  projectId: "interview-97142",
  storageBucket: "interview-97142.firebasestorage.app",
  messagingSenderId: "719501547729",
  appId: "1:719501547729:web:8cee850ed2cef9c04f0df0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}