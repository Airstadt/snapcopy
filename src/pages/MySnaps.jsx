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
    <div style={{ padding: "30px" }}>
      
      {/* NEW BUTTON — Back to Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          background: "#6c757d",
          color: "white",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        ← Back to Dashboard
      </button>

      <h1 style={{ marginBottom: "20px" }}>My Snaps</h1>

      {snaps.length === 0 && <p>You haven’t saved any snaps yet.</p>}

      <div style={{ display: "grid", gap: "20px" }}>
        {snaps.map((snap) => (
          <div
            key={snap.id}
            onClick={() => navigate(`/snaps/${snap.id}`)}
            style={{
              padding: "20px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              background: "white",
              cursor: "pointer"
            }}
          >
            <h3>{snap.title || "Untitled Snap"}</h3>
            <p style={{ opacity: 0.7 }}>{snap.mode}</p>
            <p style={{ marginTop: "10px" }}>
              {snap.output?.slice(0, 120)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
