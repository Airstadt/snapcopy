// src/pages/Profile.jsx

/**
 * SUMMARY — WHAT THIS COMPONENT DOES
 * ----------------------------------
 * This Profile page allows a logged‑in user to complete or update their
 * business profile information stored in Firestore.
 *
 * Core responsibilities:
 * 1. Load the user's existing Firestore profile on mount.
 * 2. Pre-fill the form with any saved values (businessName, industry, years).
 * 3. Allow the user to edit these fields.
 * 4. Save updates back to Firestore and mark onboardingComplete = true.
 * 5. Redirect the user back to the dashboard after saving.
 *
 * Key behaviors:
 * - Uses Firebase Auth to identify the current user.
 * - Uses Firestore getDoc() to load profile data.
 * - Uses updateDoc() to persist changes.
 * - Shows a loading state while fetching.
 * - Shows a saving state while writing.
 *
 * This page is the core of your onboarding flow and ensures that
 * SnapCopy has the business metadata needed for future AI generation.
 */

import { useState, useEffect } from "react";
import { auth, db } from "../../firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {

  const navigate = useNavigate();

  // Firebase Auth gives us the currently logged-in user.
  // We assume the user is authenticated before reaching this page.
  const user = auth.currentUser;

  // Local state for the three editable profile fields.
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [name, setName] = useState("");
 const [businessAddress, setBusinessAddress] = useState("");
 const [businessPhone, setBusinessPhone] = useState("");


  // UI state flags
  const [loading, setLoading] = useState(true);   // true until Firestore data loads
  const [saving, setSaving] = useState(false);    // true while saving to Firestore

  /**
   * Load the user's profile from Firestore on component mount.
   * This runs once because the dependency array only includes `user`.
   */
  useEffect(() => {
    const loadProfile = async () => {
      // Reference to the user's Firestore document
      const ref = doc(db, "users", user.uid);

      // Fetch the document snapshot
      const snap = await getDoc(ref);

      // If the document exists, populate the form fields
      if (snap.exists()) {
        const data = snap.data();

        // Use empty strings as fallbacks so the inputs never show undefined
        setBusinessName(data.businessName || "");
        setIndustry(data.industry || "");
        setYearsInBusiness(data.yearsInBusiness || "");
        setName(data.name || "");
        setBusinessAddress(data.businessAddress || "");
        setBusinessPhone(data.businessPhone || "");

      }

      // Remove the loading state once data is ready
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  /**
   * Handle form submission.
   * Writes updated profile fields back to Firestore.
   * Also sets onboardingComplete = true so the dashboard knows the user is done.
   */
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent page reload
    setSaving(true);    // Disable button + show "Saving..."

    const ref = doc(db, "users", user.uid);

    // Update only the fields we allow the user to edit
    await updateDoc(ref, {
      name,
    businessName,
    industry,
    yearsInBusiness,
    businessAddress,
    businessPhone,
    onboardingComplete: true, // marks onboarding as finished
    });

    // After saving, send the user back to the dashboard
    navigate("/dashboard");
  };

  // While Firestore is loading, show a simple loading message
  if (loading) {
    return <div style={{ padding: "40px" }}>Loading profile...</div>;
  }

  /**
   * MAIN RENDER
   * Displays a clean card-style form for editing profile fields.
   */
  return (
  <div
    style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "40px 20px",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
      }}
    >
      <h1>Your Profile</h1>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          borderRadius: "12px",
          background: "#f8f9fa",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* your form goes here */}
      </div>
    </div>
  </div>
);
}
