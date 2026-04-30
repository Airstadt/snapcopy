// src/snaps/Policies.jsx
import React from "react";

/**
 * Policies Component
 * Focuses purely on data input fields. 
 * Action buttons are now handled by the parent App.jsx for UI consistency.
 */
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
      
      {/* 1. Policy Type Selection */}
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

      {/* 2. Business Name Input */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>Business Name</label>
        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your business or website name"
          style={inputStyle}
        />
      </div>

      {/* 3. Key Details Textarea */}
      <div>
        <label style={{ fontWeight: "600", color: colors.textDark }}>Key Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add important details, rules, exclusions, or requirements"
          style={{ ...inputStyle, height: "120px", resize: "vertical" }}
        />
      </div>

      {/* 
          NOTE: Generate, Download, and Save buttons have been removed from here.
          They are now rendered by the Shared Action Buttons section in App.jsx 
          to ensure a uniform look across all Snaps.[cite: 3, 5]
      */}
    </div>
  );
}