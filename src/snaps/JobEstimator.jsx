/**
 * JobEstimator.jsx — SnapCopy Component
 * -------------------------------------
 * This component renders the full Job Estimator UI:
 * - Header fields (job title, customer, location, due date)
 * - Labor & Tasks (with hourly/flat rate logic)
 * - Materials (with custom UOM support)
 * - Fees, tax, discount, payment terms
 * - Total calculation (display only)
 *
 * Behavior:
 * - PUBLIC VISITORS (not logged in):
 *      • See marketing text + CTA banner
 *      • See the full estimator form
 *      • Cannot save snaps (handled in App.jsx)
 *
 * - LOGGED-IN USERS:
 *      • Do NOT see marketing text or CTA
 *      • See a clean, app-only version of the estimator
 *
 * Notes:
 * - All logic (state, handlers, calculations, PDF download) lives in App.jsx.
 * - This file ONLY handles UI and conditional rendering.
 * - Safe Firebase auth listener prevents blank screens.
 */

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function JobEstimator({
  colors,
  inputStyle,
  getInputStyle,

  header,
  setHeader,

  tasks,
  updateTask,
  removeTask,
  addTask,

  materials,
  updateMaterial,
  removeMaterial,
  addMaterial,

  fees,
  updateFee,

  financials,
  setFinancials,

  calculateTotal
}) {
  const [user, setUser] = useState(null);

  // Safe Firebase auth listener — prevents crashes on first render
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* PUBLIC MARKETING CONTENT — only visible when NOT logged in */}
      {!user && (
        <>
          <p style={{ marginBottom: "20px", color: "#4a5568" }}>
            Build a professional job estimate with labor, materials, fees, and
            automatic total calculation. Perfect for contractors, service
            businesses, and project-based work.
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

      {/* 1. HEADER DETAILS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "10px", fontWeight: "bold" }}>Job Title / Project</label>
          <input
            type="text"
            placeholder="Kitchen Remodel"
            style={inputStyle}
            value={header.jobTitle}
            onChange={(e) => setHeader({ ...header, jobTitle: e.target.value })}
          />
        </div>

        <div>
          <label style={{ fontSize: "10px", fontWeight: "bold" }}>Customer Name</label>
          <input
            type="text"
            placeholder="John Doe"
            style={inputStyle}
            value={header.customerName}
            onChange={(e) => setHeader({ ...header, customerName: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "10px", fontWeight: "bold" }}>Location</label>
          <input
            type="text"
            placeholder="Richmond, VA"
            style={inputStyle}
            value={header.location}
            onChange={(e) => setHeader({ ...header, location: e.target.value })}
          />
        </div>

        <div>
          <label style={{ fontSize: "10px", fontWeight: "bold" }}>Due Date / Expected Start</label>
          <input
            type="date"
            style={inputStyle}
            value={header.dueDate}
            onChange={(e) => setHeader({ ...header, dueDate: e.target.value })}
          />
        </div>
      </div>

      {/* 2. LABOR / TASKS */}
      <div style={{ border: `1px solid ${colors.lightGray}`, padding: "15px", borderRadius: "10px" }}>
        <h4 style={{ fontSize: "14px", color: colors.deepBlue, marginBottom: "10px" }}>
          Labor & Tasks
        </h4>

        {tasks.map((task, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 0.8fr 1fr 40px",
              gap: "10px",
              marginBottom: "10px"
            }}
          >
            <input
              type="text"
              placeholder="Task description"
              style={inputStyle}
              value={task.desc}
              onChange={(e) => updateTask(i, "desc", e.target.value)}
            />

            <select
              style={inputStyle}
              value={task.type}
              onChange={(e) => updateTask(i, "type", e.target.value)}
            >
              <option>Hourly</option>
              <option>Flat Rate</option>
            </select>

            <input
              type="number"
              placeholder="Rate"
              style={inputStyle}
              value={task.rate}
              onChange={(e) => updateTask(i, "rate", e.target.value)}
            />

            <input
              type="number"
              placeholder="Qty/Hrs"
              style={inputStyle}
              value={task.qty}
              onChange={(e) => updateTask(i, "qty", e.target.value)}
            />

            <button
              onClick={() => removeTask(i)}
              style={{
                background: colors.errorRed,
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>
        ))}

        <button
          onClick={addTask}
          style={{
            background: colors.deepBlue,
            color: "white",
            border: "none",
            padding: "5px 15px",
            borderRadius: "5px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          + Add Task
        </button>
      </div>

      {/* 3. MATERIALS */}
      <div style={{ border: `1px solid ${colors.lightGray}`, padding: "15px", borderRadius: "10px" }}>
        <h4 style={{ fontSize: "14px", color: colors.deepBlue, marginBottom: "10px" }}>
          Materials
        </h4>

        {materials.map((mat, i) => (
          <div key={i} style={{ marginBottom: "15px", borderBottom: "1px solid #eee" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 0.8fr 1fr 40px",
                gap: "10px"
              }}
            >
              <input
                type="text"
                placeholder="Material item"
                style={inputStyle}
                value={mat.desc}
                onChange={(e) => updateMaterial(i, "desc", e.target.value)}
              />

              <select
                style={inputStyle}
                value={
                  ["pcs", "lbs", "ft", "sqft", "gal", "hr"].includes(mat.uom)
                    ? mat.uom
                    : "Custom..."
                }
                onChange={(e) => {
                  const val = e.target.value;
                  updateMaterial(i, "uom", val === "Custom..." ? "" : val);
                }}
              >
                <option value="pcs">pcs (Pieces)</option>
                <option value="lbs">lbs (Pounds)</option>
                <option value="ft">ft (Linear Feet)</option>
                <option value="sqft">sqft (Square Feet)</option>
                <option value="gal">gal (Gallons)</option>
                <option value="hr">hr (Hours)</option>
                <option value="Custom...">Custom...</option>
              </select>

              <input
                type="number"
                placeholder="Qty"
                style={inputStyle}
                value={mat.qty}
                onChange={(e) => updateMaterial(i, "qty", e.target.value)}
              />

              <input
                type="number"
                placeholder="Cost"
                style={inputStyle}
                value={mat.cost}
                onChange={(e) => updateMaterial(i, "cost", e.target.value)}
              />

              <button
                onClick={() => removeMaterial(i)}
                style={{
                  background: colors.errorRed,
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>

            {/* Custom UOM input */}
            {!["pcs", "lbs", "ft", "sqft", "gal", "hr"].includes(mat.uom) && (
              <input
                type="text"
                placeholder="Enter custom unit (e.g. bags, boxes, rolls)"
                style={{
                  ...inputStyle,
                  marginTop: "8px",
                  fontSize: "13px",
                  borderColor: colors.deepBlue
                }}
                value={mat.uom}
                onChange={(e) => updateMaterial(i, "uom", e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          onClick={addMaterial}
          style={{
            background: colors.deepBlue,
            color: "white",
            border: "none",
            padding: "5px 15px",
            borderRadius: "5px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          + Add Material
        </button>
      </div>

      {/* 4. TOTALS SECTION */}
      <div
        style={{
          background: colors.lightGray,
          padding: "20px",
          borderRadius: "10px",
          marginTop: "10px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
            marginBottom: "15px"
          }}
        >
          <div>
            <label style={{ fontSize: "10px", fontWeight: "bold" }}>Discount ($)</label>
            <input
              type="number"
              style={inputStyle}
              value={financials.discount}
              onChange={(e) =>
                setFinancials({ ...financials, discount: e.target.value })
              }
            />
          </div>

          <div>
            <label style={{ fontSize: "10px", fontWeight: "bold" }}>Tax Rate (%)</label>
            <input
              type="number"
              style={inputStyle}
              value={financials.taxRate}
              onChange={(e) =>
                setFinancials({ ...financials, taxRate: e.target.value })
              }
            />
          </div>

          <div>
            <label style={{ fontSize: "10px", fontWeight: "bold" }}>Payment Terms</label>
            <select
              style={inputStyle}
              value={financials.terms}
              onChange={(e) =>
                setFinancials({ ...financials, terms: e.target.value })
              }
            >
              <option>Due on Receipt</option>
              <option>Net 7</option>
              <option>Net 15</option>
              <option>Net 30</option>
            </select>
          </div>
        </div>

        {/* TOTAL DISPLAY */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            borderTop: `1px solid rgba(0,0,0,0.1)`,
            paddingTop: "15px"
          }}
        >
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: colors.textDark
              }}
            >
              Estimated Total:{" "}
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "900",
                color: colors.deepBlue
              }}
            >
              ${calculateTotal()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
