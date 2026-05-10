import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);


      if (profile && profile.plan !== "pro") {
  return <Navigate to="/upgrade" replace />;
}

      if (currentUser) {
        const ref = doc(db, "users", currentUser.uid);
        const unsubProfile = onSnapshot(ref, (snap) => {
          setProfile(snap.data());
          setLoading(false);
        });

        return () => unsubProfile();
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Allow access to /auth ALWAYS
  if (location.pathname === "/auth") {
    return children;
  }

  // Not logged in → redirect to auth
  if (!user) return <Navigate to="/auth" replace />;

  // Logged in but NOT Pro → redirect to upgrade
  if (profile && profile.plan !== "pro") {
    return <Navigate to="/upgrade" replace />;
  }

  return children;
}
