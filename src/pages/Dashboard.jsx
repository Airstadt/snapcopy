import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

// The main dashboard page shown only to authenticated users.
export default function Dashboard() {
  const navigate = useNavigate();

  // Logs the user out of Firebase, then redirects them back to the auth page.
  const handleLogout = async () => {
    await signOut(auth);   // Firebase clears the current user session
    navigate("/auth");     // Send the user back to the login/signup screen
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome to your dashboard</h1>

      {/* Button that triggers the logout process */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
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
