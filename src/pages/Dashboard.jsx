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

  if (loading || !profile) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontSize: "1.2rem" }}>
        Loading your dashboard…
      </div>
    );
  }

  const greetingName =
    profile?.name?.trim() ||
    profile?.businessName?.trim() ||
    auth.currentUser?.email?.split("@")[0] ||
    "there";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f7ff" }}>
      {/* ⭐ SIDEBAR */}
      <aside
        style={{
          width: "240px",
          background: "#4b2aad",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          borderRight: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.6rem",
            fontWeight: "800",
            letterSpacing: "0.5px",
          }}
        >
          SnapCopy
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            style={navButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            style={navButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onClick={() => navigate("/")}
          >
            Create New Snap
          </button>
          <button
            style={navButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onClick={() => navigate("/mysnaps")}
          >
            My Snaps
          </button>
          <button
            style={navButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>
        </nav>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            style={{
              ...navButton,
              background: "rgba(255,255,255,0.15)",
              marginTop: "20px",
            }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* ⭐ MAIN CONTENT */}
      <main style={{ flex: 1, padding: "40px 50px" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "700",
              marginBottom: "10px",
              color: "#4b2aad",
            }}
          >
            Welcome back, {greetingName}
          </h1>

          <p
            style={{
              color: "#6b6b6b",
              marginTop: "4px",
              marginBottom: "16px",
            }}
          >
            Here’s what’s happening with your account today.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                background: profile.plan === "pro" ? "#10b981" : "#d9c6ff",
                color: profile.plan === "pro" ? "white" : "#4b2aad",
                padding: "6px 14px",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              {profile.plan === "pro" ? "Pro Member" : "Free Plan"}
            </span>

            {profile.onboardingComplete && (
              <span
                style={{
                  background: "#e0ffe8",
                  color: "#0f8a3b",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                Profile Complete
              </span>
            )}
          </div>
        </div>

        {/* ⭐ Quick Actions */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
          <button style={quickActionBtn} onClick={() => navigate("/")}>
            + New Snap
          </button>
          <button style={quickActionBtn} onClick={() => navigate("/mysnaps")}>
            View Snaps
          </button>
          <button style={quickActionBtn} onClick={() => navigate("/settings")}>
            Settings
          </button>
        </div>

        {/* ⭐ Overview Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div style={overviewCard}>
            <h3 style={cardTitle}>📦 Plan</h3>
            <p style={cardValue}>{profile.plan}</p>
          </div>

          <div style={overviewCard}>
            <h3 style={cardTitle}>⚡ Credits</h3>

            {/* Original dynamic credits (saved for future use) */}
            {/* <p style={cardValue}>{profile.credits}</p> */}

            {/* Temporary unlimited credits */}
            <p style={cardValue}>Unlimited</p>
        </div>


          <div style={overviewCard}>
            <h3 style={cardTitle}>📊 Snaps Created</h3>
            <p style={cardValue}>Coming soon</p>
          </div>
        </div>

        {/* ⭐ Profile Completion */}
        {!profile.onboardingComplete && (
          <div style={warningCard}>
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

        {/* ⭐ Full Business Profile */}
        {profile.onboardingComplete && (
          <div style={profileCard}>
            <h2 style={{ marginTop: 0, color: "#4b2aad" }}>
              🏢 Your Business Profile
            </h2>

            {profile.name && (
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
            )}
            {profile.businessName && (
              <p>
                <strong>Business Name:</strong> {profile.businessName}
              </p>
            )}
            {profile.industry && (
              <p>
                <strong>Industry:</strong> {profile.industry}
              </p>
            )}
            {profile.yearsInBusiness && (
              <p>
                <strong>Years in Business:</strong> {profile.yearsInBusiness}
              </p>
            )}
            {profile.businessAddress && (
              <p>
                <strong>Business Address:</strong> {profile.businessAddress}
              </p>
            )}
            {profile.businessPhone && (
              <p>
                <strong>Business Phone:</strong> {profile.businessPhone}
              </p>
            )}

            <button
              onClick={() => navigate("/")}
              style={{ ...buttonPrimary, width: "100%", marginTop: "20px" }}
            >
              Create New Snap
            </button>
          </div>
        )}

        {/* ⭐ Footer */}
        <p
          style={{
            marginTop: "60px",
            color: "#9ca3af",
            fontSize: "0.85rem",
          }}
        >
          SnapCopy © {new Date().getFullYear()} — AI‑powered content for your
          business.
        </p>
      </main>
    </div>
  );
}

/* --- Styles --- */

const navButton = {
  background: "rgba(255,255,255,0.1)",
  color: "white",
  padding: "10px 14px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "1rem",
  width: "100%",
  transition: "0.2s",
};

const quickActionBtn = {
  padding: "10px 16px",
  background: "white",
  border: "1px solid #ddd",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.95rem",
  transition: "0.2s",
};

const overviewCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  border: "1px solid #eee",
  textAlign: "left",
};

const cardTitle = {
  margin: 0,
  fontSize: "1rem",
  color: "#6b6b6b",
};

const cardValue = {
  marginTop: "8px",
  fontSize: "1.6rem",
  fontWeight: "700",
  color: "#4b2aad",
};

const warningCard = {
  background: "#fff3cd",
  border: "1px solid #ffeeba",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "30px",
};

const profileCard = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "600px",
};

const buttonPrimary = {
  padding: "12px 20px",
  background: "#6a3df5",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  border: "none",
  fontSize: "1rem",
};
