import { useNavigate } from "react-router-dom";

export default function SettingsHome() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        animation: "fadePage 0.6s ease"
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
          marginBottom: "25px",
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
          color: "#c3bed4",
          marginBottom: "10px"
        }}
      >
        Settings
      </h1>

      <p style={{ color: "#6b7280", marginBottom: "30px", fontSize: "16px" }}>
        Manage your profile, billing, and account security.
      </p>

      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
        }}
      >
        {/* ⭐ Profile Settings */}
        <div
          onClick={() => navigate("/settings/profile")}
          style={cardStyle}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
        >
          <h3 style={cardTitle}>Profile Settings</h3>
          <p style={cardText}>Update your name, business info, and contact details.</p>
        </div>

        {/* ⭐ Billing Settings */}
        <div
          onClick={() => navigate("/settings/billing")}
          style={cardStyle}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
        >
          <h3 style={cardTitle}>Billing & Subscription</h3>
          <p style={cardText}>View your plan, manage billing, or upgrade to Pro.</p>
        </div>

        {/* ⭐ Security Settings */}
        <div
          onClick={() => navigate("/settings/security")}
          style={cardStyle}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
        >
          <h3 style={cardTitle}>Security</h3>
          <p style={cardText}>Change password, reset login, or secure your account.</p>
        </div>
      </div>
    </div>
  );
}

/* --- Styles --- */

const cardStyle = {
  padding: "24px",
  background: "white",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  cursor: "pointer",
  transition: "0.25s ease"
};

const cardTitle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "8px"
};

const cardText = {
  color: "#6b7280",
  fontSize: "15px"
};

function hoverOn(e) {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.12)";
}

function hoverOff(e) {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
}
