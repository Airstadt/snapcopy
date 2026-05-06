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
    return <div style={{ padding: "40px" }}>Loading your dashboard...</div>;
  }

  // Personalized greeting logic
  const greetingName =
    profile.businessName?.trim() ||
    auth.currentUser.email.split("@")[0] ||
    "there";

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "10px" }}>
        Welcome back, {greetingName}
      </h1>

      {/* If profile is incomplete */}
      {!profile.onboardingComplete && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "12px",
            background: "#fff3cd",
            border: "1px solid #ffeeba",
            maxWidth: "450px"
          }}
        >
          
          <h2 style={{ marginTop: 0 }}>Complete Your Profile</h2>
          <p>Finish setting up your business details to unlock personalized snaps.</p>

          <button
            onClick={() => navigate("/profile")}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* If profile is complete */}
      {profile.onboardingComplete && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "12px",
            background: "#f8f9fa",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            maxWidth: "450px"
          }}
        >
          <h2>Your Business Profile</h2>

          <p><strong>Business Name:</strong> {profile.businessName}</p>
          <p><strong>Industry:</strong> {profile.industry}</p>
          <p><strong>Years in Business:</strong> {profile.yearsInBusiness}</p>

          <hr style={{ margin: "15px 0" }} />

          <p><strong>Plan:</strong> {profile.plan}</p>
          <p><strong>Credits:</strong> {profile.credits}</p>

          {/* Create Snap Button */}
          <button
            onClick={() => navigate("/create-snap")}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              background: "#28a745",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Create New Snap
          </button>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          background: "#333",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Log out
      </button>
    </div>
  );
}

