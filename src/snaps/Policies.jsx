// src/snaps/Policies.jsx
import React from "react";

export default function Policies({
  policyType,
  setPolicyType,
  businessName,
  setBusinessName,
  details,
  setDetails,
  colors,
  inputStyle,
  onDownload // Add this prop
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      
      {/* Policy Type Selection */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>Policy Type</label>
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

      {/* Business Name Input */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>Business Name</label>
        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your business or website name"
          style={inputStyle}
        />
      </div>

      {/* Key Details Textarea */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>Key Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add important details, rules, exclusions, or requirements"
          style={{ ...inputStyle, height: "120px", resize: "vertical" }}
        />
      </div>

      {/* --- NEW DOWNLOAD BUTTON (Placed Above Generate) --- */}
      <button
        onClick={onDownload}
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "10px",
          background: "white",
          color: colors.orange,
          border: `2px solid ${colors.orange}`,
          borderRadius: "10px",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Download PDF
      </button>

      {/* Generate Button */}
      <button
        onClick={() => window.generateSnap()}
        style={{
          padding: "16px",
          background: colors.orange,
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "18px"
        }}
      >
        Generate Policy
      </button>
    </div>
  );
}