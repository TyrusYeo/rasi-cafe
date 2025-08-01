// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9A76So7Adh6HOliU-FxtqJCpK7B1vl8E",
  authDomain: "rasi-b9f56.firebaseapp.com",
  projectId: "rasi-b9f56",
  storageBucket: "rasi-b9f56.firebasestorage.app",
  messagingSenderId: "1028620210488",
  appId: "1:1028620210488:web:0d70c9ef14ca28f862f1cd"
};

// Initialize Firebase only on the client side
let app;
let db;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db };
export default app; 