// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore"; 
// ⬆️ IMPORTANT: replaced getDoc with onSnapshot for real-time updates

export function useAuth() {
  const [user, setUser] = useState(null);      // Firebase Auth user
  const [profile, setProfile] = useState(null); // Firestore user profile (plan, credits, etc.)

  useEffect(() => {
    // 🔥 Listen for Firebase Auth state changes (login/logout)
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);

      if (u) {
        const ref = doc(db, "users", u.uid);

        // ⭐ REAL-TIME LISTENER FOR FIRESTORE PROFILE
        // This updates instantly when Stripe webhook writes plan: "pro"
        const stopProfileListener = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            setProfile(null);
          }
        });

        // Cleanup Firestore listener when user logs out
        return () => stopProfileListener();
      } else {
        // No user logged in → clear profile
        setProfile(null);
      }
    });

    // Cleanup Auth listener
    return () => unsub();
  }, []);

  return { user, profile };
}
