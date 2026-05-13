import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { auth as firebaseAuth } from "./firebase";
import { signOut } from "firebase/auth";
import "./UpgradeScreen.css";


export default function UpgradeScreen() {
  const navigate = useNavigate();
  const functions = getFunctions(undefined, "us-central1");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const createCheckout = httpsCallable(functions, "createCheckoutSession");
      const { data } = await createCheckout({
        email: firebaseAuth.currentUser.email,
      });

      if (data?.url) {
        window.location.assign(data.url);
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        padding: "60px 20px",
        maxWidth: "640px",
        margin: "0 auto",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "30px",
        animation: "fadePage 0.8s ease",
      }}
    >

      {/* ⭐ Gradient Hero */}
      <div
  className="glowHero"
  style={{
    padding: "40px 30px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #8a2be2 0%, #b57bff 100%)",
    color: "white",
    animation: "floatUp 1.2s ease",
  }}
      >
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800" }}>
          SnapCopy Pro
        </h1>
        <p style={{ marginTop: "14px", fontSize: "18px", opacity: 0.95 }}>
          Unlock the full power of your content workflow.
        </p>
      </div>

      {/* ⭐ Pro Benefits */}
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "18px",
          border: "1px solid #e8e8e8",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          textAlign: "left",
          animation: "slideUp 0.7s ease",
        }}
      >
        <h3
          style={{
            marginBottom: "18px",
            color: "#8a2be2",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          Why Upgrade to Pro?
        </h3>

        <ul style={{ paddingLeft: "22px", lineHeight: "1.9", fontSize: "16px" }}>
          <li><strong>Save & Modify Content</strong> — Keep every generated snap and refine it anytime.</li>
          <li><strong>Instant Recall</strong> — Quickly retrieve past content with one click.</li>
          <li><strong>Access New Features First</strong> — Get early access to new tools and AI upgrades.</li>
        </ul>

        <p
          style={{
            marginTop: "18px",
            fontSize: "15px",
            opacity: 0.75,
            textAlign: "center",
          }}
        >
          ✨ Pro unlocks your full creative flow.
        </p>
      </div>

      {/* ⭐ Upgrade Button — NOW WITH REAL CONTINUOUS GLOW */}
      <button
        onClick={handleUpgrade}
        disabled={isProcessing}
        className="glowButton"
        style={{
          padding: "18px 20px",
          background: isProcessing ? "#aaa" : "#8a2be2",
          color: "white",
          borderRadius: "12px",
          cursor: isProcessing ? "not-allowed" : "pointer",
          width: "100%",
          fontSize: "18px",
          fontWeight: "700",
          border: "none",
        }}
      >
        {isProcessing ? "Connecting to Stripe..." : "Upgrade to Pro – $19.99/mo"}
      </button>

      {/* ⭐ Log Out */}
      <button
        onClick={() => {
          signOut(firebaseAuth);
          navigate("/auth");
        }}
        style={{
          marginTop: "10px",
          padding: "12px 16px",
          background: "#444",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
          fontSize: "15px",
          border: "none",
        }}
      >
        Log Out
      </button>

      
    </div>
  );
}
