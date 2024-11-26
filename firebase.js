// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9W01KUAAPyzRahBIKmeZrIj0L8ZvJPnA",
  authDomain: "ramenrhapsody-b36a0.firebaseapp.com",
  projectId: "ramenrhapsody-b36a0",
  storageBucket: "ramenrhapsody-b36a0.firebasestorage.app",
  messagingSenderId: "1024095996348",
  appId: "1:1024095996348:web:53e161cf32150e090243b9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);