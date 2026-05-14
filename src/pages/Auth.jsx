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
      if (profile.plan === "pro") {
        navigate("/dashboard");
      } else {
        navigate(redirectPath || "/upgrade");
      }

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
      padding: "60px 20px",
      maxWidth: "640px",
      margin: "0 auto",
      textAlign: "center",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      gap: "30px",
      animation: "fadePage 0.8s ease",
    }}
  >

    {/* ⭐ Premium Gradient Hero */}
    <div
      className="glowHero"
      style={{
        padding: "45px 35px",
        borderRadius: "22px",
        background: "linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)",
        color: "white",
        animation: "floatUp 1.2s ease",
        boxShadow: "0 12px 32px rgba(109,40,217,0.35)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "34px", fontWeight: "800" }}>
        SnapCopy Pro
      </h1>
      <p style={{ marginTop: "14px", fontSize: "18px", opacity: 0.95, lineHeight: "1.5" }}>
        Unlock the full power of your content workflow.
      </p>
    </div>

    {/* ⭐ Pro Benefits */}
    <div
      style={{
        background: "#ffffff",
        padding: "32px",
        borderRadius: "20px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
        textAlign: "left",
        animation: "slideUp 0.7s ease",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
          color: "#6d28d9",
          textAlign: "center",
          fontSize: "22px",
          fontWeight: "700",
        }}
      >
        Why Upgrade to Pro?
      </h3>

      <ul style={{ paddingLeft: "22px", lineHeight: "1.9", fontSize: "16px", color: "#374151" }}>
        <li><strong>Save & Modify Content</strong> — Keep every generated snap and refine it anytime.</li>
        <li><strong>Instant Recall</strong> — Quickly retrieve past content with one click.</li>
        <li><strong>Access New Features First</strong> — Get early access to new tools and AI upgrades.</li>
      </ul>

      <p
        style={{
          marginTop: "20px",
          fontSize: "15px",
          opacity: 0.75,
          textAlign: "center",
        }}
      >
        ✨ Pro unlocks your full creative flow.
      </p>
    </div>

    {/* ⭐ Upgrade Button */}
    <button
      onClick={handleUpgrade}
      disabled={isProcessing}
      className="glowButton"
      style={{
        padding: "18px 20px",
        background: isProcessing ? "#aaa" : "#6d28d9",
        color: "white",
        borderRadius: "12px",
        cursor: isProcessing ? "not-allowed" : "pointer",
        width: "100%",
        fontSize: "18px",
        fontWeight: "700",
        border: "none",
        transition: "0.25s ease",
      }}
    >
      {isProcessing ? "Connecting to Stripe..." : "Upgrade to Pro – $19.99/mo"}
    </button>

    {/* ⭐ Log Out */}
    <button
      onClick={() => {
        signOut(firebaseAuth);
        navigate("/auth");
      }}
      style={{
        marginTop: "10px",
        padding: "12px 16px",
        background: "#374151",
        color: "white",
        borderRadius: "10px",
        cursor: "pointer",
        width: "100%",
        fontSize: "15px",
        border: "none",
        transition: "0.25s ease",
      }}
    >
      Log Out
    </button>

  </div>
);


}

export default Auth;
