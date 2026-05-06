export default function SettingsHome() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Settings</h1>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => (window.location.href = "/settings/profile")}
          style={btn}
        >
          Profile Settings
        </button>

        <button
          onClick={() => (window.location.href = "/settings/billing")}
          style={btn}
        >
          Billing
        </button>

        <button
          onClick={() => (window.location.href = "/settings/security")}
          style={btn}
        >
          Security
        </button>
      </div>
    </div>
  );
}

const btn = {
  display: "block",
  marginBottom: "10px",
  padding: "12px 20px",
  background: "#f8f9fa",
  borderRadius: "8px",
  cursor: "pointer",
  width: "250px",
  textAlign: "left",
  border: "1px solid #ddd"
};
