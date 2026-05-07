// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);

      if (u) {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        setProfile(snap.exists() ? snap.data() : null);
      } else {
        setProfile(null);
      }
    });

    return () => unsub();
  }, []);

  return { user, profile };
}
