import React from "react";

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
  return (
    <>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Business Type</label>
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

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
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

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
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