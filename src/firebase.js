import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFO-gWcOALhRUUHP8YHFQM8uGrASjjpx4",
  authDomain: "msaas-9e82a.firebaseapp.com",
  projectId: "msaas-9e82a",
  storageBucket: "msaas-9e82a.firebasestorage.app",
  messagingSenderId: "297322776876",
  appId: "1:297322776876:web:997461d305b80b2e888489"
};

// Prevent duplicate initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore
export const db = getFirestore(app);

// ⭐ ADD THIS — Firebase Auth instance
export const auth = getAuth(app);
