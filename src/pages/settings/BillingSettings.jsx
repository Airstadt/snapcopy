import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions";
import snapcopyLogo from "../../assets/snapcopyLogo.png";

export default function BillingSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/auth");

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      }

      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  const openBillingPortal = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const functions = getFunctions();
      const createPortalSession = httpsCallable(functions, "createPortalSession");

      const result = await createPortalSession({});
      const url = result.data.url;

      if (url) {
        window.location.href = url;
      } else {
        console.error("No URL returned from portal session");
      }
    } catch (err) {
      console.error("Portal error:", err);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading billing settings…</div>;
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto"
      }}
    >

      {/* ⭐ Back to Dashboard (moved above title) */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "10px 18px",
          background: "#6c757d",
          color: "white",
          borderRadius: 8,
          cursor: "pointer",
          border: "none",
          fontSize: "14px",
          marginBottom: "20px",
          fontWeight: "500",
          transition: "0.2s"
        }}
        onMouseOver={(e) => (e.target.style.background = "#5a6268")}
        onMouseOut={(e) => (e.target.style.background = "#6c757d")}
      >
        ← Back to Dashboard
      </button>

      <h1
        style={{
          fontSize: "34px",
          fontWeight: "800",
          color: "#bfb9d3",
          marginBottom: "28px"
        }}
      >
        Billing & Subscription
      </h1>

      <div
        style={{
          padding: "28px",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          marginBottom: "30px"
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}
        >
          <div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px" }}>
              Your Plan
            </h3>

            <p style={{ fontSize: "15px", color: "#6b7280", margin: 0 }}>
              You’re subscribed to SnapCopy Pro
            </p>
          </div>

          <img
            src={snapcopyLogo}
            alt="SnapCopy Logo"
            style={{ height: "120px", opacity: 0.95 }}
          />
        </div>

        {/* Perks List */}
        <ul
          style={{
            margin: "12px 0 20px 0",
            paddingLeft: "20px",
            color: "#4b5563",
            fontSize: "15px",
            lineHeight: "1.55"
          }}
        >
          <li>Save snaps and recall them at any time</li>
          <li>Edit saved snaps</li>
          <li>Regenerate saved snaps</li>
          <li>Export snaps as PDF</li>
        </ul>

        {/* Plan + Price */}
        <p style={{ fontSize: "17px", color: "#111827", marginBottom: "4px" }}>
          <strong>SnapCopy Pro</strong>
        </p>

        <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "24px" }}>
          $19.99 / month — billed monthly
        </p>

        {/* Manage Billing Button */}
        <button
          onClick={openBillingPortal}
          style={{
            padding: "12px 22px",
            background: "#4b2aad",
            color: "white",
            borderRadius: 10,
            cursor: "pointer",
            border: "none",
            fontSize: "15px",
            fontWeight: "600",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#3d2391")}
          onMouseOut={(e) => (e.target.style.background = "#4b2aad")}
        >
          Manage Billing
        </button>
      </div>
    </div>
  );
}
