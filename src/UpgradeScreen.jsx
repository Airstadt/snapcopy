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

      {/* ⭐ Premium Gradient Hero */}
      <div
        className="glowHero"
        style={{
          padding: "45px 35px",
          borderRadius: "22px",
          background: "linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)",
          color: "white",
          animation: "floatUp 1.2s ease",
          boxShadow: "0 12px 32px rgba(109,40,217,0.35)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "34px", fontWeight: "800" }}>
          SnapCopy Pro
        </h1>
        <p style={{ marginTop: "14px", fontSize: "18px", opacity: 0.95, lineHeight: "1.5" }}>
          Unlock the full power of your content workflow.
        </p>
      </div>

      {/* ⭐ Pro Benefits */}
      <div
        style={{
          background: "#ffffff",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
          textAlign: "left",
          animation: "slideUp 0.7s ease",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
            color: "#6d28d9",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          Why Upgrade to Pro?
        </h3>

        <ul style={{ paddingLeft: "22px", lineHeight: "1.9", fontSize: "16px", color: "#374151" }}>
          <li><strong>Save & Modify Content</strong> — Keep every generated snap and refine it anytime.</li>
          <li><strong>Instant Recall</strong> — Quickly retrieve past content with one click.</li>
          <li><strong>Access New Features First</strong> — Get early access to new tools and AI upgrades.</li>
        </ul>

        <p
          style={{
            marginTop: "20px",
            fontSize: "15px",
            opacity: 0.75,
            textAlign: "center",
          }}
        >
          ✨ Pro unlocks your full creative flow.
        </p>
      </div>

      {/* ⭐ Free vs Pro Comparison */}
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "18px",
          border: "1px solid #e8e8e8",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          animation: "slideUp 0.7s ease",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
            color: "#6d28d9",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          Free vs Pro
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "15px",
            color: "#374151",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingBottom: "12px" }}>Feature</th>
              <th style={{ textAlign: "center", paddingBottom: "12px" }}>Free</th>
              <th style={{ textAlign: "center", paddingBottom: "12px" }}>Pro</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ padding: "10px 0" }}>Generate Snaps</td>
              <td style={{ textAlign: "center" }}>✔️ Limited by traffic</td>
              <td style={{ textAlign: "center" }}>✔️ Unlimited</td>
            </tr>

            <tr>
              <td style={{ padding: "10px 0" }}>Save Snaps</td>
              <td style={{ textAlign: "center" }}>❌</td>
              <td style={{ textAlign: "center" }}>✔️ Unlimited</td>
            </tr>

            <tr>
              <td style={{ padding: "10px 0" }}>Modify Past Snaps</td>
              <td style={{ textAlign: "center" }}>❌</td>
              <td style={{ textAlign: "center" }}>✔️ Full editing</td>
            </tr>

            <tr>
              <td style={{ padding: "10px 0" }}>Instant Recall</td>
              <td style={{ textAlign: "center" }}>❌</td>
              <td style={{ textAlign: "center" }}>✔️ One‑click history</td>
            </tr>

            <tr>
              <td style={{ padding: "10px 0" }}>New Features</td>
              <td style={{ textAlign: "center" }}>❌ Delayed</td>
              <td style={{ textAlign: "center" }}>✔️ Early access</td>
            </tr>

            <tr>
              <td style={{ padding: "10px 0" }}>Support</td>
              <td style={{ textAlign: "center" }}>Community only</td>
              <td style={{ textAlign: "center" }}>Priority</td>
            </tr>
          </tbody>
        </table>

        <p
          style={{
            marginTop: "18px",
            fontSize: "14px",
            opacity: 0.7,
            textAlign: "center",
          }}
        >
          Free is great for quick use — Pro is built for real workflows.
        </p>
      </div>

      {/* ⭐ Upgrade Button */}
      <button
        onClick={handleUpgrade}
        disabled={isProcessing}
        className="glowButton"
        style={{
          padding: "18px 20px",
          background: isProcessing ? "#aaa" : "#6d28d9",
          color: "white",
          borderRadius: "12px",
          cursor: isProcessing ? "not-allowed" : "pointer",
          width: "100%",
          fontSize: "18px",
          fontWeight: "700",
          border: "none",
          transition: "0.25s ease",
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
          background: "#374151",
          color: "white",
          borderRadius: "10px",
          cursor: "pointer",
          width: "100%",
          fontSize: "15px",
          border: "none",
          transition: "0.25s ease",
        }}
      >
        Log Out
      </button>

    </div>
  );
}
