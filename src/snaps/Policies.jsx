// src/snaps/PoliciesCompliance.jsx
import React from "react";

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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      
      {/* Policy Type */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>
          Policy Type
        </label>
        <select
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
          style={{
            ...inputStyle,
            marginTop: "6px",
            cursor: "pointer"
          }}
        >
          <option value="">Select Policy Type</option>
          <option value="Refund Policy">Refund Policy</option>
          <option value="Warranty Policy">Warranty Policy</option>
          <option value="Privacy Policy">Privacy Policy</option>
          <option value="Terms of Service">Terms of Service</option>
        </select>
      </div>

      {/* Business Name */}
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

      {/* Key Details */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>
          Key Details
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add important details, rules, exclusions, or requirements"
          style={{
            ...inputStyle,
            height: "120px",
            resize: "vertical"
          }}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={() => window.generateSnap()}
        style={{
          padding: "14px",
          background: colors.deepBlue,
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Generate Policy
      </button>
    </div>
  );
}
