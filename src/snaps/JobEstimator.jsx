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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

      {!user && (
        <p style={{ marginBottom: "10px", color: "#4a5568" }}>
          Build a professional job estimate with labor, materials, fees, and
          automatic total calculation.
        </p>
      )}

      {/* ============================
          1. HEADER DETAILS
      ============================ */}
      <SectionCard title="Job Details" color={colors.deepBlue}>
        <TwoCol>
          <LabeledInput
            label="Job Title / Project"
            placeholder="Kitchen Remodel"
            value={header.jobTitle}
            onChange={(v) => setHeader({ ...header, jobTitle: v })}
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Customer Name"
            placeholder="John Doe"
            value={header.customerName}
            onChange={(v) => setHeader({ ...header, customerName: v })}
            inputStyle={inputStyle}
          />
        </TwoCol>

        <TwoCol>
          <LabeledInput
            label="Location"
            placeholder="Richmond, VA"
            value={header.location}
            onChange={(v) => setHeader({ ...header, location: v })}
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Due Date / Expected Start"
            type="date"
            value={header.dueDate}
            onChange={(v) => setHeader({ ...header, dueDate: v })}
            inputStyle={inputStyle}
          />
        </TwoCol>
      </SectionCard>

      {/* ============================
          2. LABOR / TASKS
      ============================ */}
      <SectionCard title="Labor & Tasks" color={colors.deepBlue}>
        {tasks.map((task, i) => (
          <div key={i} style={{ marginBottom: "20px" }}>
            <ThreeCol>
              <LabeledInput
                label="Task Description"
                placeholder="Describe the task"
                value={task.desc}
                onChange={(v) => updateTask(i, "desc", v)}
                inputStyle={inputStyle}
              />

              <LabeledSelect
                label="Type"
                value={task.type}
                onChange={(v) => updateTask(i, "type", v)}
                inputStyle={inputStyle}
                options={["Hourly", "Flat Rate"]}
              />

              <LabeledInput
                label="Rate"
                type="number"
                value={task.rate}
                onChange={(v) => updateTask(i, "rate", v)}
                inputStyle={inputStyle}
              />
            </ThreeCol>

            <TwoCol>
              <LabeledInput
                label="Qty / Hours"
                type="number"
                value={task.qty}
                onChange={(v) => updateTask(i, "qty", v)}
                inputStyle={inputStyle}
              />

              <RemoveButton
                onClick={() => removeTask(i)}
                color={colors.errorRed}
              />
            </TwoCol>
          </div>
        ))}

        <AddButton label="+ Add Task" onClick={addTask} color={colors.deepBlue} />
      </SectionCard>

      {/* ============================
          3. MATERIALS
      ============================ */}
      <SectionCard title="Materials" color={colors.deepBlue}>
        {materials.map((mat, i) => (
          <div key={i} style={{ marginBottom: "20px" }}>
            <ThreeCol>
              <LabeledInput
                label="Material Item"
                value={mat.desc}
                onChange={(v) => updateMaterial(i, "desc", v)}
                inputStyle={inputStyle}
              />

              <LabeledSelect
                label="Unit"
                value={
                  ["pcs", "lbs", "ft", "sqft", "gal", "hr"].includes(mat.uom)
                    ? mat.uom
                    : "Custom..."
                }
                onChange={(v) =>
                  updateMaterial(i, "uom", v === "Custom..." ? "" : v)
                }
                inputStyle={inputStyle}
                options={[
                  "pcs",
                  "lbs",
                  "ft",
                  "sqft",
                  "gal",
                  "hr",
                  "Custom..."
                ]}
              />

              <LabeledInput
                label="Qty"
                type="number"
                value={mat.qty}
                onChange={(v) => updateMaterial(i, "qty", v)}
                inputStyle={inputStyle}
              />
            </ThreeCol>

            <TwoCol>
              <LabeledInput
                label="Cost"
                type="number"
                value={mat.cost}
                onChange={(v) => updateMaterial(i, "cost", v)}
                inputStyle={inputStyle}
              />

              <RemoveButton
                onClick={() => removeMaterial(i)}
                color={colors.errorRed}
              />
            </TwoCol>

            {!["pcs", "lbs", "ft", "sqft", "gal", "hr"].includes(mat.uom) && (
              <LabeledInput
                label="Custom Unit"
                placeholder="bags, boxes, rolls..."
                value={mat.uom}
                onChange={(v) => updateMaterial(i, "uom", v)}
                inputStyle={{
                  ...inputStyle,
                  borderColor: colors.deepBlue
                }}
              />
            )}
          </div>
        ))}

        <AddButton
          label="+ Add Material"
          onClick={addMaterial}
          color={colors.deepBlue}
        />
      </SectionCard>

      {/* ============================
          4. TOTALS
      ============================ */}
      <SectionCard title="Totals & Summary" color={colors.deepBlue}>
        <ThreeCol>
          <LabeledInput
            label="Discount ($)"
            type="number"
            value={financials.discount}
            onChange={(v) => setFinancials({ ...financials, discount: v })}
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Tax Rate (%)"
            type="number"
            value={financials.taxRate}
            onChange={(v) => setFinancials({ ...financials, taxRate: v })}
            inputStyle={inputStyle}
          />

          <LabeledSelect
            label="Payment Terms"
            value={financials.terms}
            onChange={(v) => setFinancials({ ...financials, terms: v })}
            inputStyle={inputStyle}
            options={["Due on Receipt", "Net 7", "Net 15", "Net 30"]}
          />
        </ThreeCol>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              Estimated Total:
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "900",
                color: colors.deepBlue,
                marginLeft: "8px"
              }}
            >
              ${calculateTotal()}
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================
   REUSABLE COMPONENTS
============================ */

function SectionCard({ title, color, children }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      <h4
        style={{
          color,
          marginBottom: "5px",
          borderBottom: `2px solid ${color}`,
          display: "inline-block",
          paddingBottom: "4px"
        }}
      >
        {title}
      </h4>

      {children}
    </div>
  );
}

function LabeledInput({ label, inputStyle, onChange, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontWeight: 600, fontSize: "13px", color: "#4a5568" }}>
        {label}
      </label>
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}


function LabeledSelect({ label, options, inputStyle, onChange, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontWeight: 600, fontSize: "13px", color: "#4a5568" }}>
        {label}
      </label>
      <select
        {...props}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box"
        }}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}


function RemoveButton({ onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: color,
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "10px",
        cursor: "pointer",
        width: "100%"
      }}
    >
      ×
    </button>
  );
}

function AddButton({ label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: color,
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "10px",
        width: "fit-content"
      }}
    >
      {label}
    </button>
  );
}

function TwoCol({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      {children}
    </div>
  );
}

function ThreeCol({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "15px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      {children}
    </div>
  );
}
