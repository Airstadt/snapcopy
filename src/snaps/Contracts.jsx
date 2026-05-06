/**
 * Contracts.jsx — SnapCopy Component
 * ----------------------------------
 * This component renders the input fields for generating a contract.
 *
 * Behavior:
 * - PUBLIC VISITORS (not logged in):
 *      • See marketing text + CTA banner
 *      • See the contract form fields
 *      • Cannot save snaps (handled in App.jsx)
 *
 * - LOGGED-IN USERS:
 *      • Do NOT see marketing text or CTA
 *      • See a clean, app-only version of the form
 *
 * Notes:
 * - All state (contractType, partyA, partyB, etc.) is controlled by App.jsx.
 * - This file ONLY handles UI and conditional rendering.
 * - Safe Firebase auth listener prevents blank screens.
 */

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function Contracts({
  colors,
  inputStyle,
  contractType,
  setContractType,
  partyA,
  setPartyA,
  partyB,
  setPartyB,
  scope,
  setScope,
  terms,
  setTerms,
  specialClauses,
  setSpecialClauses,
  onDownload,     // Provided by App.jsx
  outputExists    // Provided by App.jsx
}) {
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
            Enter the contract details below. We’ll generate a clean, professional
            agreement tailored to your business needs.
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

      {/* FORM FIELDS — unchanged, controlled by App.jsx */}
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Contract Type
      </label>
      <select
        value={contractType}
        onChange={(e) => setContractType(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select contract type...</option>
        <option value="Service Agreement">Service Agreement</option>
        <option value="Maintenance Contract">Maintenance Contract</option>
        <option value="Subcontractor Agreement">Subcontractor Agreement</option>
        <option value="Change Order Agreement">Change Order Agreement</option>
        <option value="Non Disclosure Agreement">Non Disclosure Agreement</option>
      </select>

      <label
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#4a5568",
          marginTop: "10px"
        }}
      >
        Party A (Your Business)
      </label>
      <input
        type="text"
        placeholder="e.g. Ric’s HVAC Solutions"
        value={partyA}
        onChange={(e) => setPartyA(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Party B (Client / Vendor)
      </label>
      <input
        type="text"
        placeholder="e.g. John Doe / ABC Properties"
        value={partyB}
        onChange={(e) => setPartyB(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Scope of Work / Purpose
      </label>
      <textarea
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        placeholder="Describe the work, services, or purpose of the agreement..."
        style={{ ...inputStyle, height: "120px", resize: "none" }}
      />

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Terms (Payment, Duration, Responsibilities)
      </label>
      <textarea
        value={terms}
        onChange={(e) => setTerms(e.target.value)}
        placeholder="List important terms such as payment schedule, deadlines, responsibilities..."
        style={{ ...inputStyle, height: "120px", resize: "none" }}
      />

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Special Clauses (Optional)
      </label>
      <textarea
        value={specialClauses}
        onChange={(e) => setSpecialClauses(e.target.value)}
        placeholder="Confidentiality, liability limits, cancellation rules, warranties, etc."
        style={{ ...inputStyle, height: "120px", resize: "none" }}
      />

      {/* DOWNLOAD BUTTON — only appears when output exists */}
      {outputExists && (
        <button
          onClick={onDownload}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "20px",
            background: "white",
            color: colors.purple,
            border: `2px solid ${colors.purple}`,
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => (e.target.style.background = "#f5f3ff")}
          onMouseOut={(e) => (e.target.style.background = "white")}
        >
          <span style={{ fontSize: "1.2rem" }}>📄</span> Download Contract (PDF)
        </button>
      )}
    </>
  );
}
