import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

const AboutUs = ({
  colors,
  inputStyle,
  companyName,
  setCompanyName,
  industry,
  setIndustry,
  city,
  setCity,
  years,
  setYears,
  businessType,
  setBusinessType,
  customBusinessType,
  setCustomBusinessType,
  description,
  setDescription
}) => {
  const [user, setUser] = useState(null);

  // Safe Firebase auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {/* PUBLIC MARKETING CONTENT — only show when NOT logged in */}
      {!user && (
        <>
          <p style={{ marginBottom: "20px", color: "#4a5568" }}>
            Tell us your industry, location, and experience level. We will generate a
            professional, SEO‑optimized “About Us” story that builds trust with your
            local customers.
          </p>

          
        </>
      )}

      {/* FORM FIELDS — unchanged, still controlled by App.jsx */}
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Company Name
      </label>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="e.g. Ric's Tech Solutions"
        style={inputStyle}
      />

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Industry
      </label>
      <input
        type="text"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="e.g. HVAC, Plumbing, Landscaping..."
        style={inputStyle}
      />

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        City/Service Area
      </label>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="e.g. Mechanicsville, VA"
        style={inputStyle}
      />

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Years in Business
      </label>
      <input
        type="number"
        value={years}
        onChange={(e) => setYears(e.target.value)}
        placeholder="e.g. 10"
        style={inputStyle}
      />

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
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

      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        Key Selling Points / Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What makes you different? (e.g. 24/7 emergency service, licensed and insured, free estimates...)"
        style={{ ...inputStyle, height: "120px", resize: "none" }}
      />
    </>
  );
};

export default AboutUs;
