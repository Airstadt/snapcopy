// src/snaps/PoliciesCompliance.jsx
import React from "react";

export default function PoliciesCompliance({
  policyType,
  setPolicyType,
  businessName,
  setBusinessName,
  details,
  setDetails,
  handleSubmit
}) {
  return (
    <div className="snap-container">
      <h2>Policies & Compliance</h2>

      <label>Policy Type</label>
      <select value={policyType} onChange={(e) => setPolicyType(e.target.value)}>
        <option value="">Select Policy Type</option>
        <option value="Refund Policy">Refund Policy</option>
        <option value="Warranty Policy">Warranty Policy</option>
        <option value="Privacy Policy">Privacy Policy</option>
        <option value="Terms of Service">Terms of Service</option>
      </select>

      <label>Business Name</label>
      <input
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        placeholder="Your business or website name"
      />

      <label>Key Details</label>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Add important details, rules, exclusions, or requirements"
      />

      <button onClick={handleSubmit}>Generate Policy</button>
    </div>
  );
}
