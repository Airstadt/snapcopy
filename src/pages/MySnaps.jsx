import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MySnaps() {
  const [snaps, setSnaps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const snapsRef = collection(db, "users", uid, "snaps");
    const q = query(snapsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSnaps(list);
    });

    return () => unsub();
  }, []);

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        animation: "fadePage 0.6s ease",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: 25,
          padding: "10px 18px",
          background: "#4b5563",
          color: "white",
          borderRadius: 8,
          cursor: "pointer",
          border: "none",
          fontSize: "15px",
          transition: "0.25s ease",
        }}
        onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        ← Back to Dashboard
      </button>

      {/* Page Title */}
      <h1
        style={{
          marginBottom: "25px",
          fontSize: "32px",
          fontWeight: "800",
          color: "#4b2aad",
        }}
      >
        My Snaps
      </h1>

      {/* Empty State */}
      {snaps.length === 0 && (
        <div
          style={{
            padding: "40px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "16px",
          }}
        >
          You haven’t saved any snaps yet.
        </div>
      )}

      {/* Snaps Grid */}
      <div
        style={{
          display: "grid",
          gap: "20px",
          marginTop: snaps.length === 0 ? "30px" : "10px",
        }}
      >
        {snaps.map((snap) => (
          <div
            key={snap.id}
            onClick={() => navigate(`/snaps/${snap.id}`)}
            style={{
              padding: "22px",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              background: "white",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
              transition: "0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.05)";
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "700",
                color: "#1f2937",
              }}
            >
              {snap.title || "Untitled Snap"}
            </h3>

            <p
              style={{
                opacity: 0.7,
                marginTop: "6px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              {snap.mode}
            </p>

            <p
              style={{
                marginTop: "14px",
                fontSize: "15px",
                color: "#374151",
                lineHeight: "1.55",
              }}
            >
              {snap.output?.slice(0, 140)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
