/**
 * Sentiment.jsx — SnapCopy Component
 * ----------------------------------
 * This component renders the input field for sentiment analysis:
 * - User pastes raw comments or reviews
 * - App.jsx handles the AI request, formatting, and output
 *
 * Behavior:
 * - PUBLIC VISITORS (not logged in):
 *      • See marketing text + CTA banner
 *      • See the sentiment input box
 *      • Cannot save snaps (handled in App.jsx)
 *
 * - LOGGED-IN USERS:
 *      • Do NOT see marketing text or CTA
 *      • See a clean, app-only version of the tool
 *
 * Notes:
 * - All logic (state, generation, saving) lives in App.jsx.
 * - This file ONLY handles UI and conditional rendering.
 * - Safe Firebase auth listener prevents blank screens.
 */

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function Sentiment({ inputStyle, rawComments, setRawComments }) {
  const [user, setUser] = useState(null);

  // Safe Firebase auth listener — prevents crashes on first render
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <>
      {/* PUBLIC MARKETING CONTENT — only visible when NOT logged in */}
      {!user && (
        <>
          <p style={{ marginBottom: "20px", color: "#4a5568" }}>
            Paste customer comments or reviews below. SnapCopy will analyze the
            emotional tone, identify themes, and provide actionable insights.
          </p>

          <div
            style={{
              background: "#edf2f7",
              padding: "10px 15px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontWeight: "600",
              color: "#2d3748"
            }}
          >
            Interested in SnapCopy or SnapMatrix? Join the waitlist today.
          </div>
        </>
      )}

      {/* SENTIMENT INPUT BOX */}
      <textarea
        value={rawComments}
        onChange={(e) => setRawComments(e.target.value)}
        placeholder="Paste comments here..."
        style={{ ...inputStyle, height: "150px", resize: "none" }}
      />
    </>
  );
}
