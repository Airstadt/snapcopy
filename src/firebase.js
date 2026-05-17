/**
 * SUMMARY
 * This file initializes the Firebase app for your React project.
 * It ensures Firebase is only initialized once (avoiding the '[DEFAULT]' error),
 * then exposes two core services for the rest of your app:
 *   1. Firestore database instance (db)
 *   2. Firebase Authentication instance (auth)
 *
 * Any component that needs database or auth access should import from this file.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase project configuration
 * These values come from Firebase Console → Project Settings → Web App.
 * They are safe to keep client‑side because Firebase uses security rules,
 * not secret keys, to protect your data.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDFO-gWcOALhRUUHP8YHFQM8uGrASjjpx4",
  authDomain: "msaas-9e82a.firebaseapp.com",
  projectId: "msaas-9e82a",
  storageBucket: "msaas-9e82a.firebasestorage.app",
  messagingSenderId: "297322776876",
  appId: "1:297322776876:web:997461d305b80b2e888489"
};

/**
 * Initialize Firebase
 * Firebase must only be initialized once per app instance.
 * getApps() returns an array of initialized apps.
 * If none exist, initializeApp() creates one.
 * If one already exists, getApp() returns the existing instance.
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Firestore Database
 * Exported as `db` so any component can import and use it:
 *   import { db } from "../firebase";
 */
export const db = getFirestore(app);

/**
 * Firebase Authentication
 * Exported as `auth` for use in signup, login, logout, and user state checks:
 *   import { auth } from "../firebase";
 */
export const auth = getAuth(app);

