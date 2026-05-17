// src/pages/ProfileSettings.jsx

import { useState, useEffect } from "react";
import { auth, db } from "../../firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // ⭐ All editable fields
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ⭐ Load Firestore profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // ⭐ Pre-fill all fields
        setName(data.name || "");
        setBusinessName(data.businessName || "");
        setIndustry(data.industry || "");
        setYearsInBusiness(data.yearsInBusiness || "");
        setBusinessAddress(data.businessAddress || "");
        setBusinessPhone(data.businessPhone || "");
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  // ⭐ Save profile updates
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      name,
      businessName,
      industry,
      yearsInBusiness,
      businessAddress,
      businessPhone,
      onboardingComplete: true,
    });

    navigate("/dashboard");
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading profile...</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          color: "#333",
        }}
      >

        {/* ⭐ Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 18px",
            background: "#6c757d",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
            fontSize: "14px",
            marginBottom: "20px",
            fontWeight: "500",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#5a6268")}
          onMouseOut={(e) => (e.target.style.background = "#6c757d")}
        >
          ← Back to Dashboard
        </button>

        <h1
          style={{
            color: "#beb6d6",
            fontWeight: "800",
            marginBottom: "20px",
            fontSize: "32px",
          }}
        >
          Your Profile
        </h1>

        <form
          onSubmit={handleSave}
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "12px",
            background: "#f8f9fa",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* ⭐ Name */}
          <label style={{ display: "flex", flexDirection: "column" }}>
            <strong>Name</strong>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              style={inputStyle}
            />
          </label>

          {/* ⭐ Business Name */}
          <label style={{ display: "flex", flexDirection: "column" }}>
            <strong>Business Name</strong>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. John Doe's Plumbing Inc."
              style={inputStyle}
            />
          </label>

          {/* ⭐ Industry */}
          <label style={{ display: "flex", flexDirection: "column" }}>
            <strong>Industry</strong>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. HVAC, Plumbing, Landscaping"
              style={inputStyle}
            />
          </label>

          {/* ⭐ Years in Business */}
          <label style={{ display: "flex", flexDirection: "column" }}>
            <strong>Years in Business</strong>
            <input
              type="number"
              value={yearsInBusiness}
              onChange={(e) => setYearsInBusiness(e.target.value)}
              placeholder="e.g. 10"
              style={inputStyle}
            />
          </label>

          {/* ⭐ Business Address */}
          <label style={{ display: "flex", flexDirection: "column" }}>
            <strong>Business Address</strong>
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="Street, City, State"
              style={inputStyle}
            />
          </label>

          {/* ⭐ Business Phone */}
          <label style={{ display: "flex", flexDirection: "column" }}>
            <strong>Business Phone</strong>
            <input
              type="tel"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              placeholder="e.g. (555) 123‑4567"
              style={inputStyle}
            />
          </label>

          {/* ⭐ Save Button */}
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px",
              background: "#6a3df5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ⭐ Shared input style
const inputStyle = {
  marginTop: "6px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};
