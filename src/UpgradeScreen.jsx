import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";

export default function UpgradeScreen() {
  const navigate = useNavigate();
  const functions = getFunctions();

  const handleUpgrade = async () => {
    const createCheckout = httpsCallable(functions, "createCheckoutSession");
    const { data } = await createCheckout();
    window.location.href = data.url;
  };

  return (
    <div style={{
      padding: "40px",
      maxWidth: "500px",
      margin: "0 auto",
      textAlign: "center"
    }}>
      <h1>Upgrade to SnapCopy Pro</h1>
      <p style={{ marginTop: "10px", fontSize: "16px", opacity: 0.8 }}>
        Access to the Dashboard and Setup requires a Pro subscription.
      </p>

      <button
        onClick={handleUpgrade}
        style={{
          marginTop: "20px",
          padding: "14px 20px",
          background: "#8a2be2",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
          fontSize: "16px",
          fontWeight: "bold"
        }}
      >
        Upgrade to Pro – $19.99/mo
      </button>

      <button
        onClick={() => navigate("/auth")}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "#444",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
          fontSize: "15px"
        }}
      >
        Create Account / Login
      </button>
    </div>
  );
}
