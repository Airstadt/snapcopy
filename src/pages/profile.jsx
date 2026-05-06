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
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
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
    <div style={{ padding: "40px" }}>
      <h1>Complete Your Profile</h1>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          borderRadius: "12px",
          background: "#f8f9fa",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          maxWidth: "450px"
        }}
      >
        <form onSubmit={handleSave}>
  {/* 
    NAME — REQUIRED FIELD
    ---------------------
    - This is the only mandatory field in the form.
    - Controlled input: its value is tied to the `name` state variable.
    - `setName` updates the state on every keystroke.
    - `required` ensures the form cannot be submitted without a value.
  */}
  <label style={{ display: "block", marginBottom: "15px" }}>
    <strong>Your Name</strong>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
      placeholder="John Doe"
      required
    />
  </label>

  {/* 
    BUSINESS NAME — OPTIONAL
    ------------------------
    - Useful for branding or AI personalization.
    - Controlled input tied to `businessName`.
    - No validation required.
  */}
  <label style={{ display: "block", marginBottom: "15px" }}>
    <strong>Business Name (optional)</strong>
    <input
      type="text"
      value={businessName}
      onChange={(e) => setBusinessName(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
      placeholder="Acme Marketing"
    />
  </label>

  {/* 
    INDUSTRY — OPTIONAL
    -------------------
    - Helps categorize the user or tailor AI outputs.
    - Controlled input tied to `industry`.
  */}
  <label style={{ display: "block", marginBottom: "15px" }}>
    <strong>Industry (optional)</strong>
    <input
      type="text"
      value={industry}
      onChange={(e) => setIndustry(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
      placeholder="Real Estate, Fitness, SaaS..."
    />
  </label>

  {/* 
    YEARS IN BUSINESS — OPTIONAL
    ----------------------------
    - Numeric field for business maturity.
    - Controlled input tied to `yearsInBusiness`.
    - No min/max validation applied here.
  */}
  <label style={{ display: "block", marginBottom: "15px" }}>
    <strong>Years in Business (optional)</strong>
    <input
      type="number"
      value={yearsInBusiness}
      onChange={(e) => setYearsInBusiness(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
      placeholder="3"
    />
  </label>

  {/* 
    BUSINESS ADDRESS — OPTIONAL
    ---------------------------
    - Useful for location‑based AI outputs or business metadata.
    - Controlled input tied to `businessAddress`.
  */}
  <label style={{ display: "block", marginBottom: "15px" }}>
    <strong>Business Address (optional)</strong>
    <input
      type="text"
      value={businessAddress}
      onChange={(e) => setBusinessAddress(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
      placeholder="123 Main St, Richmond VA"
    />
  </label>

  {/* 
    BUSINESS PHONE — OPTIONAL
    -------------------------
    - Useful for contact info or AI‑generated business profiles.
    - Controlled input tied to `businessPhone`.
    - No phone validation applied here (could be added later).
  */}
  <label style={{ display: "block", marginBottom: "15px" }}>
    <strong>Business Phone (optional)</strong>
    <input
      type="text"
      value={businessPhone}
      onChange={(e) => setBusinessPhone(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
      placeholder="(555) 123‑4567"
    />
  </label>

  {/* 
    SUBMIT BUTTON
    -------------
    - Disabled while `saving` is true to prevent duplicate submissions.
    - Button text changes dynamically based on saving state.
  */}
  <button
    type="submit"
    disabled={saving}
    style={{
      marginTop: "10px",
      padding: "10px 20px",
      background: "#333",
      color: "white",
      borderRadius: "6px",
      cursor: "pointer",
      width: "100%"
    }}
  >
    {saving ? "Saving..." : "Save Profile"}
  </button>
</form>

      </div>
    </div>
  );
}
