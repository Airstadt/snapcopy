import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  sendPasswordResetEmail,
  updatePassword,
  updateEmail
} from "firebase/auth";
import {
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SecuritySettings() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load 2FA state + activity logs
  useEffect(() => {
    const loadData = async () => {
      if (!user) return navigate("/auth");

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setTwoFAEnabled(snap.data().twoFAEnabled || false);
      }

      // Load activity logs
      const logsRef = collection(db, "users", user.uid, "activityLogs");
      const q = query(logsRef, orderBy("timestamp", "desc"), limit(10));
      const logsSnap = await getDocs(q);

      setActivityLogs(
        logsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );

      setLoading(false);
    };

    loadData();
  }, [navigate, user]);

  const logActivity = async (action) => {
    await addDoc(collection(db, "users", user.uid, "activityLogs"), {
      action,
      timestamp: new Date()
    });
  };

  const handlePasswordResetEmail = async () => {
    await sendPasswordResetEmail(auth, user.email);
    await logActivity("Sent password reset email");
    alert("Password reset email sent.");
  };

  const handlePasswordChange = async () => {
    if (!newPassword) return alert("Enter a new password.");

    try {
      await updatePassword(user, newPassword);
      await logActivity("Changed password");
      alert("Password updated.");
      setNewPassword("");
    } catch (err) {
      alert("Failed to update password. You may need to re-login.");
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail) return alert("Enter a new email.");

    try {
      await updateEmail(user, newEmail);
      await updateDoc(doc(db, "users", user.uid), { email: newEmail });
      await logActivity("Changed email");
      alert("Email updated.");
      setNewEmail("");
    } catch (err) {
      alert("Failed to update email. You may need to re-login.");
    }
  };

  const toggleTwoFA = async () => {
    const newState = !twoFAEnabled;
    setTwoFAEnabled(newState);

    await updateDoc(doc(db, "users", user.uid), {
      twoFAEnabled: newState
    });

    await logActivity(newState ? "Enabled 2FA" : "Disabled 2FA");
  };

  const logoutAllDevices = async () => {
    await logActivity("Logged out all devices");

    // Optional: call backend to revoke tokens
    // await fetch("https://api.snapcopy.online/revoke-tokens", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ uid: user.uid })
    // });

    await auth.signOut();
    navigate("/auth");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    await logActivity("Deleted account");

    await deleteDoc(doc(db, "users", user.uid));
    await user.delete();
    navigate("/auth");
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading security settings…</div>;
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "34px", fontWeight: "800", color: "#4b2aad" }}>
        Security Settings
      </h1>

      {/* 2FA */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Two‑Factor Authentication</h3>

        <p style={descStyle}>
          Add an extra layer of security to your account.
        </p>

        <button onClick={toggleTwoFA} style={buttonPrimary}>
          {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
        </button>
      </div>

      {/* Change Email */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Change Email</h3>

        <input
          type="email"
          placeholder="New email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleEmailChange} style={buttonPrimary}>
          Update Email
        </button>
      </div>

      {/* Change Password */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Change Password</h3>

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handlePasswordChange} style={buttonPrimary}>
          Update Password
        </button>

        <button onClick={handlePasswordResetEmail} style={buttonSecondary}>
          Send Reset Email
        </button>
      </div>

      {/* Session Management */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Session Management</h3>

        <button onClick={logoutAllDevices} style={buttonSecondary}>
          Log Out of All Devices
        </button>
      </div>

      {/* Activity Logs */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Recent Activity</h3>

        {activityLogs.length === 0 ? (
          <p style={descStyle}>No recent activity.</p>
        ) : (
          activityLogs.map((log) => (
            <p key={log.id} style={logStyle}>
              • {log.action} —{" "}
              {new Date(log.timestamp.seconds * 1000).toLocaleString()}
            </p>
          ))
        )}
      </div>

      {/* Danger Zone */}
      <div style={cardStyle}>
        <h3 style={{ ...titleStyle, color: "#dc3545" }}>Danger Zone</h3>

        <button onClick={handleDeleteAccount} style={buttonDanger}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "24px",
  background: "white",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  marginBottom: "30px"
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  marginBottom: "10px"
};

const descStyle = {
  fontSize: "15px",
  color: "#6b7280",
  marginBottom: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  marginBottom: "12px",
  fontSize: "15px"
};

const buttonPrimary = {
  padding: "12px 20px",
  background: "#4b2aad",
  color: "white",
  borderRadius: 8,
  cursor: "pointer",
  border: "none",
  fontSize: "15px",
  marginRight: "10px"
};

const buttonSecondary = {
  padding: "12px 20px",
  background: "#0d6efd",
  color: "white",
  borderRadius: 8,
  cursor: "pointer",
  border: "none",
  fontSize: "15px",
  marginTop: "10px"
};

const buttonDanger = {
  padding: "12px 20px",
  background: "#dc3545",
  color: "white",
  borderRadius: 8,
  cursor: "pointer",
  border: "none",
  fontSize: "15px"
};

const logStyle = {
  fontSize: "14px",
  color: "#374151",
  marginBottom: "6px"
};
