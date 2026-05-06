/**
 * Responder.jsx — SnapCopy Component
 * ----------------------------------
 * This component renders the input fields for generating a social media or
 * customer‑facing response:
 * - Business type (with custom option)
 * - Tone / brand voice
 * - Message or situation being responded to
 *
 * Behavior:
 * - PUBLIC VISITORS (not logged in):
 *      • See marketing text + CTA banner
 *      • See the full responder form
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

const Responder = ({
  colors,
  inputStyle,
  businessType,
  setBusinessType,
  customBusinessType,
  setCustomBusinessType,
  tone,
  setTone,
  description,
  setDescription
}) => {
  const [user, setUser] = useState(null);

  // Safe Firebase auth listener — prevents crashes on first render
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <>
      {/* PUBLIC MARKETING CONTENT — only visible when NOT logged in */}
      {!user && (
        <>
          <p style={{ marginBottom: "20px", color: "#4a5568" }}>
            Choose your business type, tone, and paste the message you're responding to.
            SnapCopy will generate a polished, on‑brand reply that fits your voice.
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

      {/* BUSINESS TYPE */}
      <label
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#4a5568"
        }}
      >
        Business Type
      </label>

      <select
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select type...</option>
        <option value="Family Owned">Family Owned & Operated</option>
        <option value="Locally Owned">Locally Owned</option>
        <option value="Veteran Owned">Veteran Owned</option>
        <option value="Commercial Only">Commercial Specialist</option>
        <option value="Residential Only">Residential Specialist</option>
        <option value="custom">Other (Specify below)</option>
      </select>

      {businessType === "custom" && (
        <input
          type="text"
          value={customBusinessType}
          onChange={(e) => setCustomBusinessType(e.target.value)}
          placeholder="Enter custom business type..."
          style={inputStyle}
        />
      )}

      {/* TONE */}
      <label
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#4a5568"
        }}
      >
        Brand Voice / Tone
      </label>

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select tone...</option>
        <option value="Professional">Professional & Authoritative</option>
        <option value="Friendly">Friendly & Approachable</option>
        <option value="Witty">Witty & Energetic</option>
        <option value="Urgent">Urgent & Direct</option>
      </select>

      {/* DESCRIPTION */}
      <label
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#4a5568"
        }}
      >
        What are we responding to?
      </label>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Paste the customer comment or describe the post goal..."
        style={{ ...inputStyle, height: "100px", resize: "none" }}
      />
    </>
  );
};

export default Responder;
