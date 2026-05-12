import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { auth as firebaseAuth } from "./firebase";
import { signOut } from "firebase/auth";

const STRIPE_PUBLISHABLE_KEY ="pk_test_51TVJEgADENv5PhcjEuwG61vojCrJBn8IZ2A2ZTomxmSR6VPJUcwJtjHHejDNdueerU92H5uIPBmXnsCCfMrh8RHk00PkS85NWA";

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
      // This sends the user directly to the Stripe-hosted payment page
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
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
      <h1>Upgrade to SnapCopy Pro</h1>
      <p style={{ marginTop: "10px", fontSize: "16px", opacity: 0.8 }}>
        Access to the Dashboard and Setup requires a Pro subscription.
      </p>

      <button
        onClick={handleUpgrade}
        disabled={isProcessing}
        style={{
          marginTop: "20px",
          padding: "14px 20px",
          background: isProcessing ? "#aaa" : "#8a2be2",
          color: "white",
          borderRadius: "8px",
          cursor: isProcessing ? "not-allowed" : "pointer",
          width: "100%",
          fontSize: "16px",
          fontWeight: "bold",
          border: "none",
        }}
      >
        {isProcessing ? "Connecting to Stripe..." : "Upgrade to Pro – $19.99/mo"}
      </button>
      <button
  onClick={() => {
    signOut(firebaseAuth);
    navigate("/auth"); // or wherever your login page is
  }}
  style={{
    marginTop: "20px",
    padding: "10px 16px",
    background: "#444",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontSize: "14px",
    border: "none",
  }}
>
  Log Out
</button>
    </div>
    
  );
}
