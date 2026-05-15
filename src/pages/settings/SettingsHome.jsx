import { useNavigate } from "react-router-dom";export default function SettingsHome() {
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
      <h1
        style={{
          fontSize: "34px",
          fontWeight: "800",
          color: "#4b2aad",
          marginBottom: "30px"
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
        {/* Profile Settings */}
        <div
          onClick={() => navigate("/settings/profile")}
          style={{
            padding: "24px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            cursor: "pointer",
            transition: "0.25s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "8px"
            }}
          >
            Profile Settings
          </h3>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            Update your name, business info, and contact details.
          </p>
        </div>

        {/* Billing Settings */}
        <div
          onClick={() => navigate("/settings/billing")}
          style={{
            padding: "24px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            cursor: "pointer",
            transition: "0.25s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "8px"
            }}
          >
            Billing & Subscription
          </h3>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            View your plan, manage billing, or upgrade to Pro.
          </p>
        </div>

        {/* Security Settings */}
        <div
          onClick={() => navigate("/settings/security")}
          style={{
            padding: "24px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            cursor: "pointer",
            transition: "0.25s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "8px"
            }}
          >
            Security
          </h3>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            Change password, reset login, or secure your account.
          </p>
        </div>
      </div>
    </div>
  );
}
