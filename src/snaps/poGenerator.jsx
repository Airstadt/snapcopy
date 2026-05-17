/**
 * PoGenerator.jsx — SnapCopy Component
 * ------------------------------------
 * This component renders the full Purchase Order generator UI:
 * - Buyer info, vendor info, shipping info
 * - PO details, items, remarks, totals
 * - Independent line‑item notes
 * - Dynamic tax, discount, shipping, and other cost calculations
 *
 * Behavior:
 * - PUBLIC VISITORS (not logged in):
 *      • See marketing text + CTA banner
 *      • See the full PO form
 *      • Cannot save snaps (handled in App.jsx)
 *
 * - LOGGED-IN USERS:
 *      • Do NOT see marketing text or CTA
 *      • See a clean, app-only version of the PO generator
 *
 * Notes:
 * - All logic (state, totals, PDF generation, handlers) lives in App.jsx.
 * - This file ONLY handles UI and conditional rendering.
 * - Safe Firebase auth listener prevents blank screens.
 */

import React, { useState, useEffect } from "react";
import { auth } from "../firebase";

export default function PoGenerator({
  buyerInfo,
  setBuyerInfo,
  vendorInfo,
  setVendorInfo,
  poDetails,
  setPoDetails,
  poItems,
  setPoItems,
  poTotals,
  setPoTotals,
  colors,
  inputStyle,
  getInputStyle,
  updateItem,
  user
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

      {/* PUBLIC MARKETING CONTENT */}
      {!user && (
        <p style={{ marginBottom: "10px", color: "#4a5568" }}>
          Create a clean, professional Purchase Order with line‑item notes,
          tax handling, shipping, and totals.
        </p>
      )}

      {/* ============================
          1. BILL TO + SHIP TO
      ============================ */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* BILL TO */}
        <SectionCard title="Bill To (Buyer)" color={colors.poGreen}>
          <LabeledInput
            label="Company Name"
            value={buyerInfo.companyName}
            onChange={(v) => setBuyerInfo({ ...buyerInfo, companyName: v })}
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Billing Address"
            value={buyerInfo.companyAddress}
            onChange={(v) => setBuyerInfo({ ...buyerInfo, companyAddress: v })}
            inputStyle={inputStyle}
          />

          <TwoCol>
            <LabeledInput
              label="Contact Name"
              value={buyerInfo.contactName}
              onChange={(v) => setBuyerInfo({ ...buyerInfo, contactName: v })}
              inputStyle={inputStyle}
            />

            <LabeledInput
              label="Contact Email"
              value={buyerInfo.contactEmail}
              onChange={(v) => setBuyerInfo({ ...buyerInfo, contactEmail: v })}
              inputStyle={inputStyle}
            />
          </TwoCol>
        </SectionCard>

        {/* SHIP TO */}
        <SectionCard title="Ship To" color={colors.poGreen}>
          <LabeledInput
            label="Shipping Address"
            value={poDetails.shippingAddress || ""}
            onChange={(v) => setPoDetails({ ...poDetails, shippingAddress: v })}
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Recipient Name"
            value={poDetails.shippingRecipient || ""}
            onChange={(v) =>
              setPoDetails({ ...poDetails, shippingRecipient: v })
            }
            inputStyle={inputStyle}
          />
        </SectionCard>
      </div>

      {/* ============================
          2. PURCHASED FROM + SHIP FROM
      ============================ */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* PURCHASED FROM */}
        <SectionCard title="Purchased From" color={colors.poGreen}>
          <LabeledInput
            label="Vendor Name"
            value={vendorInfo.vendorName}
            onChange={(v) => setVendorInfo({ ...vendorInfo, vendorName: v })}
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Vendor Address"
            value={vendorInfo.vendorAddress}
            onChange={(v) => setVendorInfo({ ...vendorInfo, vendorAddress: v })}
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Payment Terms"
            value={vendorInfo.vendorPaymentTerms}
            onChange={(v) =>
              setVendorInfo({ ...vendorInfo, vendorPaymentTerms: v })
            }
            placeholder="Net 30"
            inputStyle={inputStyle}
          />
        </SectionCard>

        {/* SHIP FROM */}
        <SectionCard title="Ship From (Optional)" color={colors.poGreen}>
          <LabeledInput
            label="Ship From Address"
            value={vendorInfo.shipFromAddress || ""}
            onChange={(v) =>
              setVendorInfo({ ...vendorInfo, shipFromAddress: v })
            }
            placeholder="Leave blank if same as Vendor"
            inputStyle={inputStyle}
          />
        </SectionCard>
      </div>

      {/* ============================
          3. PO DETAILS
      ============================ */}
      <SectionCard title="PO Details" color={colors.poGreen}>
        <TwoCol>
          <LabeledInput
            label="PO Number"
            value={poDetails.poNumber}
            onChange={(v) => setPoDetails({ ...poDetails, poNumber: v })}
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="PO Date"
            type="date"
            value={poDetails.poDate}
            onChange={(v) => setPoDetails({ ...poDetails, poDate: v })}
            inputStyle={inputStyle}
          />
        </TwoCol>

        <TwoCol>
          <LabeledInput
            label="Shipping Method"
            value={poDetails.shippingMethod}
            onChange={(v) =>
              setPoDetails({ ...poDetails, shippingMethod: v })
            }
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Shipping Terms"
            value={poDetails.shippingTerms}
            onChange={(v) =>
              setPoDetails({ ...poDetails, shippingTerms: v })
            }
            placeholder="FOB Destination"
            inputStyle={inputStyle}
          />
        </TwoCol>
      </SectionCard>

      {/* ============================
          4. ORDER ITEMS
      ============================ */}
      <SectionCard title="Order Items" color={colors.poGreen}>
        {poItems.map((item, index) => (
          <div key={index} style={{ marginBottom: "25px" }}>
            <TwoCol>
              <LabeledInput
                label="Item Description"
                value={item.itemName}
                onChange={(v) => updateItem(index, "itemName", v)}
                inputStyle={inputStyle}
              />

              <LabeledInput
                label="Part Number"
                value={item.partNumber}
                onChange={(v) => updateItem(index, "partNumber", v)}
                inputStyle={inputStyle}
              />
            </TwoCol>

            <ThreeCol>
              <LabeledInput
                label="Qty"
                type="number"
                value={item.quantity}
                onChange={(v) => updateItem(index, "quantity", v)}
                inputStyle={inputStyle}
              />

              <LabeledInput
                label="Price ($)"
                type="number"
                value={item.unitPrice}
                onChange={(v) => updateItem(index, "unitPrice", v)}
                inputStyle={inputStyle}
              />

              <CheckboxField
                label="Tax?"
                checked={item.taxable}
                onChange={(v) => updateItem(index, "taxable", v)}
              />
            </ThreeCol>

            <LabeledTextarea
              label="User Remarks / Line Notes"
              value={item.lineNotes || ""}
              onChange={(v) => updateItem(index, "lineNotes", v)}
              inputStyle={inputStyle}
            />

            <button
              onClick={() =>
                setPoItems(poItems.filter((_, i) => i !== index))
              }
              style={{
                marginTop: "10px",
                background: colors.errorRed,
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Remove Item
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setPoItems([
              ...poItems,
              {
                itemName: "",
                partNumber: "",
                quantity: 1,
                unitPrice: 0,
                lineNotes: "",
                taxable: false
              }
            ])
          }
          style={{
            background: colors.poGreen,
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          + Add Line Item
        </button>
      </SectionCard>

      {/* ============================
          5. FINANCIAL SUMMARY
      ============================ */}
      <SectionCard title="Financial Summary" color={colors.poGreen}>
        <TwoCol>
          <LabeledInput
            label="Discount (%)"
            type="number"
            value={poTotals.discountRate}
            onChange={(v) =>
              setPoTotals({ ...poTotals, discountRate: v })
            }
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Sales Tax (%)"
            type="number"
            value={poTotals.taxRate}
            onChange={(v) =>
              setPoTotals({ ...poTotals, taxRate: v })
            }
            inputStyle={inputStyle}
          />
        </TwoCol>

        <TwoCol>
          <LabeledInput
            label="Shipping ($)"
            type="number"
            value={poTotals.shippingCost}
            onChange={(v) =>
              setPoTotals({ ...poTotals, shippingCost: v })
            }
            inputStyle={inputStyle}
          />

          <LabeledInput
            label="Other ($)"
            type="number"
            value={poTotals.otherCost}
            onChange={(v) =>
              setPoTotals({ ...poTotals, otherCost: v })
            }
            inputStyle={inputStyle}
          />
        </TwoCol>

        <div style={{ marginTop: "20px" }}>
          <SummaryRow label="Subtotal" value={poTotals.subtotal} />
          <SummaryRow
            label="Grand Total"
            value={poTotals.grandTotal}
            highlight
          />
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

function LabeledInput({ label, inputStyle, ...props }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      <label style={{ fontWeight: 600, fontSize: "13px", color: "#4a5568" }}>
        {label}
      </label>
      <input
        {...props}
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

function LabeledTextarea({ label, inputStyle, ...props }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      <label style={{ fontWeight: 600, fontSize: "13px", color: "#4a5568" }}>
        {label}
      </label>
      <textarea
        {...props}
        style={{
          ...inputStyle,
          height: "80px",
          resize: "vertical",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      <label style={{ fontSize: "12px", fontWeight: 600 }}>{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
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

function SummaryRow({ label, value, highlight }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "8px",
        fontWeight: highlight ? "bold" : "normal",
        color: highlight ? "#48bb78" : "inherit",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      <span>{label}:</span>
      <span>${value}</span>
    </div>
  );
}

