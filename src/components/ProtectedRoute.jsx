import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// A wrapper component that only renders its children if the user is logged in.
// If not logged in, it redirects to /auth.
export default function ProtectedRoute({ children }) {
  // Tracks whether Firebase is still checking the user's auth state.
  const [loading, setLoading] = useState(true);

  // Holds the current authenticated user (null if not logged in).
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to Firebase's auth state listener.
    // This fires whenever the user's login status changes.
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);   // Save the user (or null)
      setLoading(false);      // Mark the check as complete
    });

    // Cleanup: unsubscribe from the listener when the component unmounts.
    return () => unsub();
  }, []);

  // While Firebase is still determining the user's state, show a loading screen.
  if (loading) {
    return <div>Loading...</div>;
  }

  // If a user exists, allow access to the protected content.
  // If not, redirect them to the /auth page.
  return user ? children : <Navigate to="/auth" replace />;
}
    