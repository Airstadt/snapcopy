/**
 * Policies.jsx — SnapCopy Component
 * ---------------------------------
 * This component renders the input fields for generating business policies:
 * - Policy type (Refund, Warranty, Privacy, Terms of Service)
 * - Business name
 * - Key details / rules / exclusions
 *
 * Behavior:
 * - PUBLIC VISITORS (not logged in):
 *      • See marketing text + CTA banner
 *      • See the full policy form
 *      • Cannot save snaps (handled in App.jsx)
 *
 * - LOGGED-IN USERS:
 *      • Do NOT see marketing text or CTA
 *      • See a clean, app-only version of the form
 *
 * Notes:
 * - All logic (state, generation, saving) lives in App.jsx.
 * - This file ONLY handles UI and conditional rendering.
 * - Safe Firebase auth listener prevents blank screens.
 */

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function Policies({
  policyType,
  setPolicyType,
  businessName,
  setBusinessName,
  details,
  setDetails,
  colors,
  inputStyle
}) {
  const [user, setUser] = useState(null);

  // Safe Firebase auth listener — prevents crashes on first render
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

      {/* PUBLIC MARKETING CONTENT — only visible when NOT logged in */}
      {!user && (
        <>
          <p style={{ marginBottom: "20px", color: "#4a5568" }}>
            Generate professional business policies tailored to your company.
            Choose a policy type, enter your business name, and add key details.
          </p>

          <div
            style={{
              background: "#edf2f7",
              padding: "10px 15px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontWeight: "600",
              color: "#2d3748"
            }}
          >
            Interested in SnapCopy or SnapMatrix? Join the waitlist today.
          </div>
        </>
      )}

      {/* 1. Policy Type Selection */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>
          Policy Type
        </label>

        <select
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
          style={{ ...inputStyle, marginTop: "6px", cursor: "pointer" }}
        >
          <option value="">Select Policy Type</option>
          <option value="Refund Policy">Refund Policy</option>
          <option value="Warranty Policy">Warranty Policy</option>
          <option value="Privacy Policy">Privacy Policy</option>
          <option value="Terms of Service">Terms of Service</option>
        </select>
      </div>

      {/* 2. Business Name Input */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>
          Business Name
        </label>

        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your business or website name"
          style={inputStyle}
        />
      </div>

      {/* 3. Key Details Textarea */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>
          Key Details
        </label>

        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add important details, rules, exclusions, or requirements"
          style={{ ...inputStyle, height: "120px", resize: "vertical" }}
        />
      </div>

      {/* 
        NOTE:
        Generate, Download, and Save buttons are NOT included here.
        They are rendered by the Shared Action Bar in App.jsx
        to maintain consistent UI across all Snaps.
      */}
    </div>
  );
}
