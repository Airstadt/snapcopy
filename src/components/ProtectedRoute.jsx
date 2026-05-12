// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);   // Wait for auth + profile
  const [user, setUser] = useState(null);         // Firebase Auth user
  const [profile, setProfile] = useState(null);   // Firestore profile
  const location = useLocation();

  useEffect(() => {
    // 🔥 Listen for Firebase Auth state changes
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // 🔥 Real-time Firestore listener for user profile
        const ref = doc(db, "users", currentUser.uid);
        const unsubProfile = onSnapshot(ref, (snap) => {
          setProfile(snap.data() || null);
          setLoading(false);
        });

        // Cleanup Firestore listener when user logs out
        return () => unsubProfile();
      } else {
        // No user logged in
        setProfile(null);
        setLoading(false);
      }
    });

    // Cleanup Auth listener
    return () => unsubAuth();
  }, []);

  // ⏳ Still loading auth or profile → show loading screen
  if (loading) return <div>Loading...</div>;

  // 🔓 Allow access to /auth ALWAYS
  if (location.pathname === "/auth") {
    return children;
  }

  // ❌ Not logged in → redirect to login
  if (!user) return <Navigate to="/auth" replace />;

  // ❌ Logged in but NOT Pro → redirect to upgrade
  // (profile is now guaranteed to be loaded)
  if (profile?.plan !== "pro") {
    return <Navigate to="/upgrade" replace />;
  }

  // ✅ User is Pro → allow access
  return children;
}
