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
import snapcopyLogo from "../assets/snapcopyLogo.png";
import { sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prevent redirect before Firestore profile loads
  const [checkingProfile, setCheckingProfile] = useState(true);

  // ============================================================
  // AUTH STATE LISTENER — loads Firestore profile before redirect
  // ============================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCheckingProfile(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // ⭐ UPDATED: All fields optional + added missing fields
        await setDoc(ref, {
          email: user.email,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          plan: "free",
          credits: 100,

          // ⭐ Optional profile fields
          name: "",
          businessName: "",
          industry: "",
          yearsInBusiness: "",
          businessAddress: "",
          businessPhone: "",

          onboardingComplete: false,
        });
      } else {
        await updateDoc(ref, { lastLogin: Date.now() });
      }

      const profile = snap.exists() ? snap.data() : { plan: "free" };

      // Redirect based on plan
      navigate("/dashboard");

      setCheckingProfile(false);
    });

    return () => unsubscribe();
  }, [navigate, redirectPath]);

  if (checkingProfile) return null;

  // ============================================================
  // LOGIN / SIGNUP HANDLER
  // ============================================================
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
          // ⭐ UPDATED: All fields optional + added missing fields
          await setDoc(userRef, {
            email: userCred.user.email,
            createdAt: Date.now(),
            lastLogin: Date.now(),
            plan: "free",
            credits: 100,

            name: "",
            businessName: "",
            industry: "",
            yearsInBusiness: "",
            businessAddress: "",
            businessPhone: "",

            onboardingComplete: false,
          });
        }

        // Redirect handled by onAuthStateChanged

      } else {
        // SIGNUP
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        // ⭐ UPDATED: All fields optional + added missing fields
        await setDoc(doc(db, "users", userCred.user.uid), {
          email: userCred.user.email,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          plan: "free",
          credits: 100,

          name: "",
          businessName: "",
          industry: "",
          yearsInBusiness: "",
          businessAddress: "",
          businessPhone: "",

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


      const inputStyle = {
          width: "100%",
          marginTop: "6px",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "1rem",
          outline: "none",
          transition: "border 0.2s ease",
    };
  // ============================================================
  // UI
  // ============================================================
  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #f4f0ff, #ffffff)",
      padding: "20px",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "white",
        padding: "40px",
        borderRadius: "18px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      {/* LOGO */}
      <div style={{ marginBottom: "15px" }}>
        <img
          src={snapcopyLogo}
          alt="SnapCopy Logo"
          style={{ width: "70px", opacity: 0.9 }}
        />
      </div>

      {/* MODE HEADER */}
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "800",
          marginBottom: "8px",
          color: mode === "login" ? "#4b2aad" : "#28a745",
        }}
      >
        {mode === "login" ? "Log in to SnapCopy" : "Create your SnapCopy account"}
      </h1>

      {/* SUBTEXT */}
      <p
        style={{
          color: "#6b7280",
          marginBottom: "30px",
          fontSize: "0.95rem",
          lineHeight: "1.5",
        }}
      >
        {mode === "login"
          ? "Welcome back! Enter your credentials to continue."
          : "Create an account to start generating AI‑powered content."}
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        <label style={{ display: "block", marginBottom: "18px" }}>
          <span style={{ fontWeight: "600", color: "#374151" }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              transition: "0.2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #4b2aad")}
            onBlur={(e) => (e.target.style.border = "1px solid #d1d5db")}
          />
        </label>

        <label style={{ display: "block", marginBottom: "18px" }}>
          <span style={{ fontWeight: "600", color: "#374151" }}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              transition: "0.2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #4b2aad")}
            onBlur={(e) => (e.target.style.border = "1px solid #d1d5db")}
          />
        </label>

        {error && (
          <div
            style={{
              background: "#ffe6e6",
              color: "#b30000",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "14px",
            background: mode === "login" ? "#4b2aad" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "1.05rem",
            fontWeight: "700",
            cursor: "pointer",
            marginTop: "10px",
            opacity: isSubmitting ? 0.7 : 1,
            transition: "0.25s ease",
          }}
        >
          {isSubmitting
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
            ? "Log in"
            : "Sign up"}
        </button>
        
      </form>



      {/* MODE SWITCH */}
      <button
        type="button"
        onClick={toggleMode}
        style={{
          marginTop: "25px",
          background: "none",
          border: "none",
          color: "#4b2aad",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "0.95rem",
        }}
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  </div>

  
);


}

export default Auth;
