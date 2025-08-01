// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9A76So7Adh6HOliU-FxtqJCpK7B1vl8E",
  authDomain: "rasi-b9f56.firebaseapp.com",
  projectId: "rasi-b9f56",
  storageBucket: "rasi-b9f56.firebasestorage.app",
  messagingSenderId: "1028620210488",
  appId: "1:1028620210488:web:0d70c9ef14ca28f862f1cd",
  measurementId: "G-CVE300LVKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app; 