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

import {
  handleAboutPDF,
  handleApologyPDF,
  handleResponderPDF,
  handleSentimentPDF,
  handlePoliciesPDF,
  handleContractPDF,
  handlePoPDF,
  handleEstimatorPDF
} from "../pdf/pdfHandlers";

export default function SnapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [snap, setSnap] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  // ⭐ NEW — editable output state
  const [editedOutput, setEditedOutput] = useState("");

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
        setEditedOutput(data.output || ""); // ⭐ initialize editable output
      } else {
        navigate("/mysnaps");
      }

      setLoading(false);
    };

    loadSnap();
  }, [id, navigate]);

  // ⭐ NEW — Save edited output
  const saveOutput = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "snaps", id), {
      output: editedOutput,
      updatedAt: serverTimestamp()
    });

    setSnap((prev) => ({ ...prev, output: editedOutput }));
    alert("Changes saved!");
  };

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

  // Regenerate snap
  const regenerateSnap = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const payload = {
      mode: snap.mode,
      ...snap.input
    };

    try {
      const response = await fetch("https://api.snapcopy.online/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server error");

      const result =
        data.about ||
        data.reply ||
        data.apology ||
        data.sentiment ||
        data.po ||
        data.contract ||
        data.policy ||
        data.estimate ||
        JSON.stringify(data, null, 2);

      const newOutput =
        typeof result === "string" ? result : JSON.stringify(result, null, 2);

      await updateDoc(doc(db, "users", user.uid, "snaps", id), {
        output: newOutput,
        updatedAt: serverTimestamp()
      });

      setSnap((prev) => ({ ...prev, output: newOutput }));
      setEditedOutput(newOutput); // ⭐ keep editor in sync
    } catch (err) {
      console.error("Regenerate error:", err);
      alert("Failed to regenerate snap.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontSize: "18px",
          color: "#6b7280"
        }}
      >
        Loading snap…
      </div>
    );
  }

  // PDF Download Router
  const downloadPDF = () => {
    if (!snap || !snap.output) return;

    const mode = snap.mode;
    const input = snap.input;
    const output = editedOutput; // ⭐ use edited version

    switch (mode) {
      case "about":
        handleAboutPDF({ input, output });
        break;
      case "responder":
        handleResponderPDF({ input, output });
        break;
      case "apology":
        handleApologyPDF({ input, output });
        break;
      case "sentiment":
        handleSentimentPDF({ input, output });
        break;
      case "policies":
        handlePoliciesPDF({ input, output });
        break;
      case "contracts":
        handleContractPDF({ input, output });
        break;
      case "po":
        handlePoPDF({ input });
        break;
      case "estimator":
        handleEstimatorPDF({ input, output });
        break;
      default:
        alert("This Snap type does not support PDF export yet.");
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: 900,
        margin: "0 auto",
        animation: "fadePage 0.6s ease"
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/mysnaps")}
        style={{
          marginBottom: 25,
          padding: "10px 18px",
          background: "#4b5563",
          color: "white",
          borderRadius: 8,
          cursor: "pointer",
          border: "none",
          fontSize: "15px",
          transition: "0.25s ease"
        }}
        onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        ← Back to My Snaps
      </button>

      {/* Editable Title */}
      {editingTitle ? (
        <div style={{ marginBottom: 25 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            style={{
              fontSize: "30px",
              padding: "10px",
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              marginBottom: 10
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
              padding: "10px 18px",
              background: "#4b2aad",
              color: "white",
              borderRadius: 8,
              cursor: "pointer",
              border: "none",
              fontSize: "15px"
            }}
          >
            Save Title
          </button>
        </div>
      ) : (
        <h1
          onClick={() => setEditingTitle(true)}
          style={{
            cursor: "pointer",
            marginBottom: 10,
            fontSize: "32px",
            fontWeight: "800",
            color: "#d2d8e0"
          }}
          title="Click to edit title"
        >
          {title || "Untitled Snap"}
        </h1>
      )}

      <p style={{ opacity: 0.7, marginBottom: 20, fontSize: "15px" }}>
        {snap.mode}
      </p>

      {/* ⭐ Editable Output Box */}
      <textarea
        value={editedOutput}
        onChange={(e) => setEditedOutput(e.target.value)}
        style={{
          marginTop: 10,
          padding: "24px",
          background: "white",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          width: "100%",
          minHeight: "300px",
          fontSize: "16px",
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
          fontFamily: "inherit",
          resize: "vertical",
          color: "#374151"
        }}
      />

      {/* ACTION BUTTON ROW */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: 25,
          flexWrap: "wrap"
        }}
      >
        {/* ⭐ Save Changes */}
        <button
          onClick={saveOutput}
          style={{
            padding: "12px 20px",
            background: "#4b2aad",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
            fontSize: "15px"
          }}
        >
          Save Changes
        </button>

        {/* Regenerate */}
        <button
          onClick={regenerateSnap}
          style={{
            padding: "12px 20px",
            background: "#0d6efd",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
            fontSize: "15px"
          }}
        >
          Regenerate Snap
        </button>

        {/* Duplicate */}
        <button
          onClick={duplicateSnap}
          style={{
            padding: "12px 20px",
            background: "#4b5563",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
            fontSize: "15px"
          }}
        >
          Duplicate Snap
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          style={{
            padding: "12px 20px",
            background: "#dc3545",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
            fontSize: "15px"
          }}
        >
          Delete Snap
        </button>

        {/* Download PDF */}
        <button
          onClick={downloadPDF}
          style={{
            padding: "12px 20px",
            background: "#198754",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
            fontSize: "15px"
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
