import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontSize: "1.2rem" }}>
        Loading your dashboard…
      </div>
    );
  }

  // ⭐ Greeting priority: name → businessName → email username
  const greetingName =
    profile?.name?.trim() ||
    profile?.businessName?.trim() ||
    auth.currentUser?.email?.split("@")[0] ||
    "there";

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
          maxWidth: "900px",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <h1
          style={{
            fontSize: "2.6rem",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#4b2aad",
          }}
        >
          Welcome back, {greetingName}
        </h1>

        {/* Optional badge */}
        {profile?.onboardingComplete && (
          <div
            style={{
              display: "inline-block",
              background: "#d9c6ff",
              color: "#4b2aad",
              padding: "6px 14px",
              borderRadius: "20px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Profile Complete
          </div>
        )}

        <p
          style={{
            color: "#555",
            marginBottom: "40px",
            fontSize: "1.15rem",
          }}
        >
          Your hub for managing snaps, your business profile, and your subscription.
        </p>

        {/* Overview Section */}
        <div
          style={{
            background: "#f3eaff",
            border: "1px solid #d8c8ff",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "40px",
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#4b2aad" }}>Your Account Overview</h2>
          <p style={{ color: "#4b2aad", margin: "10px 0 0 0" }}>
            Keep your business profile up to date to ensure your SnapCopy results
            are perfectly tailored to your brand.
          </p>
        </div>

        {/* Button Row */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          

          <button onClick={() => navigate("/settings")} style={buttonSecondary}>
            Settings
          </button>

          <button onClick={() => navigate("/mysnaps")} style={buttonPrimary}>
            My Snaps
          </button>
        </div>

        {/* Profile Completion Card */}
        {!profile?.onboardingComplete && (
          <div style={cardWarning}>
            <h2 style={{ marginTop: 0 }}>Complete Your Profile</h2>
            <p style={{ marginBottom: "20px" }}>
              Your business details help SnapCopy generate more accurate and
              personalized content.
            </p>

            <button
              onClick={() => navigate("/settings/profile")}
              style={buttonPrimary}
            >
              Complete Profile
            </button>
          </div>
        )}

        {/* Full Business Profile */}
        {profile?.onboardingComplete && (
          <div style={card}>
            <h2 style={{ marginTop: 0, color: "#4b2aad" }}>
              Your Business Profile
            </h2>

            {/* Only show fields that exist */}
            {profile.name && <p><strong>Name:</strong> {profile.name}</p>}
            {profile.businessName && (
              <p><strong>Business Name:</strong> {profile.businessName}</p>
            )}
            {profile.industry && (
              <p><strong>Industry:</strong> {profile.industry}</p>
            )}
            {profile.yearsInBusiness && (
              <p><strong>Years in Business:</strong> {profile.yearsInBusiness}</p>
            )}
            {profile.businessAddress && (
              <p><strong>Business Address:</strong> {profile.businessAddress}</p>
            )}
            {profile.businessPhone && (
              <p><strong>Business Phone:</strong> {profile.businessPhone}</p>
            )}

            <hr style={{ margin: "15px 0" }} />

            <p><strong>Plan:</strong> {profile.plan}</p>
            <p><strong>Credits:</strong> {profile.credits}</p>

            <button
                onClick={() => navigate("/")}
                style={{
                  ...buttonSuccess,
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                Create New Snap
              </button>
          </div>
        )}

        {/* Logout */}
        <div style={{ marginTop: "40px" }}>
          <button onClick={handleLogout} style={buttonDark}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Reusable Styles --- */

const buttonPrimary = {
  padding: "10px 20px",
  background: "#6a3df5",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  border: "none",
  fontSize: "1rem",
};

const buttonSecondary = {
  padding: "10px 20px",
  background: "#6c757d",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  border: "none",
  fontSize: "1rem",
};

const buttonSuccess = {
  padding: "12px 20px",
  background: "#28a745",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  border: "none",
  fontSize: "1rem",
};

const buttonDark = {
  padding: "10px 20px",
  background: "#333",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  border: "none",
  fontSize: "1rem",
};

const card = {
  marginTop: "20px",
  padding: "25px",
  borderRadius: "12px",
  background: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "500px",
  marginLeft: "auto",
  marginRight: "auto",
};

const cardWarning = {
  ...card,
  background: "#fff3cd",
  border: "1px solid #ffeeba",
};
