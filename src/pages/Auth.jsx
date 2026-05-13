// ============================================================================
// Auth.jsx — Updated with correct redirect logic for Pro users
// ============================================================================

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, db } from "../firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // NEW: Track profile loading so we don't redirect too early
  const [checkingProfile, setCheckingProfile] = useState(true);

  // NEW: Wait for Firestore profile before redirecting
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCheckingProfile(false);
        return;
      }

      // Load Firestore profile
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // Create missing profile
        await setDoc(ref, {
          email: user.email,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          plan: "free",
          credits: 100,
          businessName: null,
          industry: null,
          yearsInBusiness: null,
          onboardingComplete: false,
        });
      } else {
        // Update last login
        await updateDoc(ref, { lastLogin: Date.now() });
      }

      const profile = snap.exists() ? snap.data() : { plan: "free" };

      // ⭐ Correct redirect logic
      if (profile.plan === "pro") {
        navigate("/dashboard");
      } else {
        navigate(redirectPath || "/upgrade");
      }

      setCheckingProfile(false);
    });

    return () => unsubscribe();
  }, [navigate, redirectPath]);

  // Prevent UI flash while checking profile
  if (checkingProfile) return null;

  // Login / Signup handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const userCred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        const userRef = doc(db, "users", userCred.user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          await updateDoc(userRef, { lastLogin: Date.now() });
        } else {
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

        // Redirect handled by onAuthStateChanged
      } else {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

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

        // Redirect handled by onAuthStateChanged
      }
    } catch (err) {
      console.error(err);

      let message = "Something went wrong. Please try again.";
      if (err.code === "auth/invalid-email") message = "That email address is not valid.";
      else if (err.code === "auth/user-not-found") message = "No account found with that email.";
      else if (err.code === "auth/wrong-password") message = "Incorrect password.";
      else if (err.code === "auth/email-already-in-use") message = "That email is already registered.";
      else if (err.code === "auth/weak-password") message = "Password should be at least 6 characters.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
