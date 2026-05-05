// ============================================================================
// Auth.jsx — Summary
// ----------------------------------------------------------------------------
// This component handles all authentication logic for SnapCopy.
// It supports login and signup modes, listens for auth state changes,
// redirects authenticated users to the dashboard, and manages Firestore
// user profile creation and updates (createdAt, lastLogin, plan, credits, etc.).
// The UI includes form inputs, error handling, loading states, and a toggle
// between login and signup modes. No logic or structure has been modified.
// ============================================================================

// src/pages/Auth.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, db } from "../firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

function Auth() {
  const navigate = useNavigate();

  // Track whether user is logging in or signing up
  const [mode, setMode] = useState("login");

  // Controlled form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state for loading and error messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect immediately if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
    return () => unsubscribe();
  }, [navigate]);

  // Main login/signup handler with Firestore profile creation/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        // Attempt login
        const userCred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        // Reference to Firestore user document
        const userRef = doc(db, "users", userCred.user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          // Update last login timestamp
          await updateDoc(userRef, { lastLogin: Date.now() });
        } else {
          // Create missing profile for older accounts
          await setDoc(userRef, {
            email: userCred.user.email,
            createdAt: Date.now(),
            lastLogin: Date.now(),
            plan: "free",
            credits: 100,
            businessName: null,
            industry: null,
            yearsInBusiness: null,
            onboardingComplete: false,
          });
        }
      } else {
        // Create new account
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        // Create Firestore profile for new user
        await setDoc(doc(db, "users", userCred.user.uid), {
          email: userCred.user.email,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          plan: "free",
          credits: 100,
          businessName: null,
          industry: null,
          yearsInBusiness: null,
          onboardingComplete: false,
        });
      }
    } catch (err) {
      console.error(err);

      // Friendly error messages based on Firebase error codes
      let message = "Something went wrong. Please try again.";
      if (err.code === "auth/invalid-email") message = "That email address is not valid.";
      else if (err.code === "auth/user-not-found") message = "No account found with that email.";
      else if (err.code === "auth/wrong-password") message = "Incorrect password.";
      else if (err.code === "auth/email-already-in-use") message = "That email is already registered.";
      else if (err.code === "auth/weak-password") message = "Password should be at least 6 characters.";

      setError(message);
    } finally {
      // Always stop loading state
      setIsSubmitting(false);
    }
  };

  // Switch between login and signup modes
  const toggleMode = () => {
    setError("");
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{mode === "login" ? "Log in to SnapCopy" : "Create your SnapCopy account"}</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Log in"
              : "Sign up"}
          </button>
        </form>

        <button className="auth-toggle" type="button" onClick={toggleMode}>
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
