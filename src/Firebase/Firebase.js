// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2-86O0hIkrV0843HCSNr8l_Oqke9f8DE",
  authDomain: "wellnessapp-e7aa2.firebaseapp.com",
  projectId: "wellnessapp-e7aa2",
  storageBucket: "wellnessapp-e7aa2.firebasestorage.app",
  messagingSenderId: "690388707071",
  appId: "1:690388707071:web:c0e0f2008159c8994e4eca",
  measurementId: "G-9SWNZWRV2K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
