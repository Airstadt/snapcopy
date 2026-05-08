import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

export default function SnapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [snap, setSnap] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  // Load snap on mount
  useEffect(() => {
    const loadSnap = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/auth");

      const ref = doc(db, "users", user.uid, "snaps", id);
      const snapDoc = await getDoc(ref);

      if (snapDoc.exists()) {
        const data = snapDoc.data();
        setSnap(data);
        setTitle(data.title || "");
      } else {
        navigate("/mysnaps");
      }

      setLoading(false);
    };

    loadSnap();
  }, [id, navigate]);

  // Delete snap
  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "snaps", id));
    navigate("/mysnaps");
  };

  // Duplicate snap
  const duplicateSnap = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const originalRef = doc(db, "users", user.uid, "snaps", id);
    const originalDoc = await getDoc(originalRef);

    if (!originalDoc.exists()) return;

    const data = originalDoc.data();

    const newRef = doc(collection(db, "users", user.uid, "snaps"));
    await setDoc(newRef, {
      ...data,
      createdAt: serverTimestamp(),
      title: (data.title || "Snap") + " (Copy)"
    });

    navigate(`/snaps/${newRef.id}`);
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading snap...</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/mysnaps")}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          background: "#6c757d",
          color: "white",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        ← Back to My Snaps
      </button>

      {/* Editable Title */}
      {editingTitle ? (
        <div style={{ marginBottom: 20 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            style={{
              fontSize: "28px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: 6
            }}
          />

          <button
            onClick={async () => {
              const user = auth.currentUser;
              await updateDoc(doc(db, "users", user.uid, "snaps", id), {
                title
              });
              setEditingTitle(false);
            }}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              background: "#4a5568",
              color: "white",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Save Title
          </button>
        </div>
      ) : (
        <h1
          onClick={() => setEditingTitle(true)}
          style={{ cursor: "pointer", marginBottom: 20 }}
          title="Click to edit title"
        >
          {title || "Untitled Snap"}
        </h1>
      )}

      <p style={{ opacity: 0.7 }}>{snap.mode}</p>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          background: "white",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          whiteSpace: "pre-wrap",
          lineHeight: 1.6
        }}
      >
        {snap.output}
      </div>

      {/* Duplicate Button */}
      <button
        onClick={duplicateSnap}
        style={{
          marginTop: 20,
          marginRight: 10,
          padding: "10px 20px",
          background: "#4a5568",
          color: "white",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Duplicate Snap
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#dc3545",
          color: "white",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Delete Snap
      </button>
    </div>
  );
}
