import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFO-gWcOALhRUUHP8YHFQM8uGrASjjpx4",
  authDomain: "msaas-9e82a.firebaseapp.com",
  projectId: "msaas-9e82a",
  storageBucket: "msaas-9e82a.firebasestorage.app",
  messagingSenderId: "297322776876",
  appId: "1:297322776876:web:997461d305b80b2e888489"
};

// Check if a Firebase app is already initialized to prevent the '[DEFAULT]' error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore WITHOUT the "MSaaS" string
export const db = getFirestore(app);