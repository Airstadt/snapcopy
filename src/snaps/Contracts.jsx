import React from "react";

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
  onDownload,    // 1. Add this prop
  outputExists   // 2. Add this prop
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
        <option value="">Select contract type...</option>
        <option value="Service Agreement">Service Agreement</option>
        <option value="Maintenance Contract">Maintenance Contract</option>
        <option value="Subcontractor Agreement">Subcontractor Agreement</option>
        <option value="Change Order Agreement">Change Order Agreement</option>
        <option value="Non Disclosure Agreement">Non Disclosure Agreement</option>
      </select>

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568", marginTop: "10px" }}>
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
          onMouseOver={(e) => e.target.style.background = "#f5f3ff"}
          onMouseOut={(e) => e.target.style.background = "white"}
        >
          <span style={{ fontSize: "1.2rem" }}>📄</span> Download Contract (PDF)
        </button>
      )}
      
    </>
    
  );
}

