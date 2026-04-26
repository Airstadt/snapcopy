import React, { useState } from "react";

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
  setSpecialClauses
}) {
  return (
    <>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Contract Type
      </label>
      <select
        value={contractType}
        onChange={(e) => setContractType(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select type...</option>
        <option value="Service Agreement">Service Agreement</option>
        <option value="Independent Contractor Agreement">Independent Contractor Agreement</option>
        <option value="Maintenance Contract">Maintenance Contract</option>
        <option value="Partnership Agreement">Partnership Agreement</option>
        <option value="NDA">Non‑Disclosure Agreement (NDA)</option>
        <option value="custom">Other (Specify below)</option>
      </select>

      {contractType === "custom" && (
        <input
          type="text"
          placeholder="Enter custom contract type..."
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
          style={inputStyle}
        />
      )}

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
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
    </>
  );
}
