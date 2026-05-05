// src/pages/Auth.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If user is already logged in, send them to dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsSubmitting(true);

  try {
    if (mode === "login") {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Update lastLogin
      await updateDoc(doc(db, "users", userCred.user.uid), {
        lastLogin: Date.now(),
      });

    } else {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Create Firestore user profile
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: userCred.user.email,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        plan: "free",
        credits: 100,

        businessName: null,
        industry: null,
        yearsInBusiness: null,

        onboardingComplete: false
      });
    }

    // Redirect handled by onAuthStateChanged
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
//----------------------------------------------------page styling ------------------------------------------------//
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

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
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
