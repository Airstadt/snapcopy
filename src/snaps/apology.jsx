/**
 * Apology.jsx — SnapCopy Component
 * --------------------------------
 * This component renders the input fields for generating an apology message.
 *
 * Behavior:
 * - PUBLIC VISITORS (not logged in):
 *      • See marketing text + CTA banner
 *      • See the form fields
 *      • Cannot save snaps (handled in App.jsx)
 *
 * - LOGGED-IN USERS:
 *      • Do NOT see marketing text or CTA
 *      • See a clean, app-only version of the form
 *
 * Notes:
 * - All state (issueType, apologyContext, etc.) is controlled by App.jsx.
 * - This file ONLY handles UI and conditional rendering.
 * - Safe Firebase auth listener prevents blank screens.
 */

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

const Apology = ({
  colors,
  inputStyle,
  issueType,
  setIssueType,
  apologyContext,
  setApologyContext
}) => {
  const [user, setUser] = useState(null);

  // Safe Firebase auth listener — prevents crashes on first render
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {/* PUBLIC MARKETING CONTENT — only visible when NOT logged in */}
      {!user && (
        <>
          <p style={{ marginBottom: "20px", color: "#4a5568" }}>
            Provide the issue type and context. We’ll generate a professional,
            customer‑friendly apology message that restores trust and resolves the
            situation.
          </p>

          
        </>
      )}

      {/* FORM FIELDS — unchanged, controlled by App.jsx */}
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Issue Type
      </label>
      <select
        value={issueType}
        onChange={(e) => setIssueType(e.target.value)}
        style={inputStyle}
      >
        <option value="">What went wrong?</option>
        <option value="delay">Service or Shipping Delay</option>
        <option value="quality">Workmanship / Quality Issue</option>
        <option value="communication">Poor Communication / No-Show</option>
        <option value="billing">Billing or Overcharge Dispute</option>
        <option value="behavior">Staff Behavior / Professionalism</option>
      </select>

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Context / Details
      </label>
      <textarea
        value={apologyContext}
        onChange={(e) => setApologyContext(e.target.value)}
        placeholder="Provide context (e.g. 'We missed the appointment because of a truck breakdown')..."
        style={{ ...inputStyle, height: "100px", resize: "none" }}
      />
    </>
  );
};

export default Apology;
