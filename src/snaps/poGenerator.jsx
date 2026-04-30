import React, { useState } from "react";

export default function PoGenerator({
  colors,
  inputStyle,
  getInputStyle,
  buyerInfo, setBuyerInfo,
  vendorInfo, setVendorInfo,
  poDetails, setPoDetails,
  poItems, setPoItems,
  poTotals, setPoTotals,
  onDownload // 1. ADD THIS PROP
}) {

  const updateItem = (index, field, value) => {
    const newItems = [...poItems];
    newItems[index][field] = value;
    setPoItems(newItems);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "12px", border: `1px solid ${colors.lightGray}` }}>
          <h4 style={{ color: colors.poGreen, marginBottom: "15px", borderBottom: `2px solid ${colors.poGreen}`, display: "inline-block" }}>Buyer Details</h4>

          <InputField label="Company Name" value={buyerInfo.companyName} onChange={(v) => setBuyerInfo({...buyerInfo, companyName: v})} colors={colors} getInputStyle={getInputStyle} />
          <InputField label="Address" value={buyerInfo.companyAddress} onChange={(v) => setBuyerInfo({...buyerInfo, companyAddress: v})} colors={colors} getInputStyle={getInputStyle} />

          <div style={{ display: "flex", gap: "10px" }}>
            <InputField label="Contact Name" value={buyerInfo.contactName} onChange={(v) => setBuyerInfo({...buyerInfo, contactName: v})} colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Contact Email" value={buyerInfo.contactEmail} onChange={(v) => setBuyerInfo({...buyerInfo, contactEmail: v})} colors={colors} getInputStyle={getInputStyle} />
          </div>
        </div>

        <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "12px", border: `1px solid ${colors.lightGray}` }}>
          <h4 style={{ color: colors.poGreen, marginBottom: "15px", borderBottom: `2px solid ${colors.poGreen}`, display: "inline-block" }}>Vendor Details</h4>

          <InputField label="Vendor Name" value={vendorInfo.vendorName} onChange={(v) => setVendorInfo({...vendorInfo, vendorName: v})} colors={colors} getInputStyle={getInputStyle} />
          <InputField label="Vendor Address" value={vendorInfo.vendorAddress} onChange={(v) => setVendorInfo({...vendorInfo, vendorAddress: v})} colors={colors} getInputStyle={getInputStyle} />
          <InputField label="Payment Terms" value={vendorInfo.vendorPaymentTerms} onChange={(v) => setVendorInfo({...vendorInfo, vendorPaymentTerms: v})} placeholder="Net 30" colors={colors} getInputStyle={getInputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", padding: "15px", background: "#f1f5f9", borderRadius: "10px" }}>
        <InputField label="PO Number" value={poDetails.poNumber} onChange={(v) => setPoDetails({...poDetails, poNumber: v})} colors={colors} getInputStyle={getInputStyle} />
        <InputField label="PO Date" type="date" value={poDetails.poDate} onChange={(v) => setPoDetails({...poDetails, poDate: v})} colors={colors} getInputStyle={getInputStyle} />
        <InputField label="Delivery Date" type="date" value={poDetails.deliveryDate} onChange={(v) => setPoDetails({...poDetails, deliveryDate: v})} colors={colors} getInputStyle={getInputStyle} />
        <InputField label="Shipping Method" value={poDetails.shippingMethod} onChange={(v) => setPoDetails({...poDetails, shippingMethod: v})} colors={colors} getInputStyle={getInputStyle} />
        <InputField label="Shipping Terms" value={poDetails.shippingTerms} onChange={(v) => setPoDetails({...poDetails, shippingTerms: v})} placeholder="FOB Destination" colors={colors} getInputStyle={getInputStyle} />
      </div>

      <div style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "12px", padding: "20px" }}>
        <h4 style={{ color: colors.poGreen, marginBottom: "15px" }}>Order Items</h4>

        {poItems.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: `2px solid ${colors.lightGray}55` }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.6fr 0.8fr 0.6fr 40px", gap: "10px", alignItems: "end" }}>
              <InputField label="Item Description" value={item.itemName} onChange={(v) => updateItem(index, "itemName", v)} placeholder="Service or Product Name" colors={colors} getInputStyle={getInputStyle} />
              <InputField label="Part Number" value={item.partNumber} onChange={(v) => updateItem(index, "partNumber", v)} placeholder="SKU/ID" colors={colors} getInputStyle={getInputStyle} />
              <InputField label="Qty" type="number" value={item.quantity} onChange={(v) => updateItem(index, "quantity", v)} colors={colors} getInputStyle={getInputStyle} />
              <InputField label="Price ($)" type="number" value={item.unitPrice} onChange={(v) => updateItem(index, "unitPrice", v)} colors={colors} getInputStyle={getInputStyle} />

              <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
                <label style={{ fontSize: "10px", fontWeight: "bold" }}>Tax?</label>
                <input type="checkbox" checked={item.taxable} onChange={(e) => updateItem(index, "taxable", e.target.checked)} />
              </div>

              <button onClick={() => setPoItems(poItems.filter((_, i) => i !== index))} style={{ height: "40px", background: colors.errorRed, color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ marginTop: "12px", width: "100%", opacity: 0.5 }}>
              <label style={{ fontSize: "10px", fontWeight: "700", color: "#718096", textTransform: "uppercase" }}>Where Used (Subscribers Only) *</label>
              <input type="text" disabled placeholder="Track product/service usage and quantity per item (Will not be included in PDF)" style={{ ...inputStyle, cursor: "not-allowed", fontSize: "12px", backgroundColor: "#f1f5f9" }} />
            </div>
          </div>
        ))}

        <button onClick={() => setPoItems([...poItems, { itemName: "", partNumber: "", quantity: 1, unitPrice: 0, unitOfMeasure: "pcs", taxable: false, discount: 0, lineNotes: "", whereUsed: "" }])} style={{ background: colors.poGreen, color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>+ Add Line Item</button>
      </div>

      


       


      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        
        <div style={{ width: "450px", padding: "20px", background: "#2d3748", color: "white", borderRadius: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
            <InputField label="Discount (%)" type="number" value={poTotals.discountRate} onChange={(v) => setPoTotals({...poTotals, discountRate: v})} colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Discount ($)" type="number" value={poTotals.discountAmount} onChange={(v) => setPoTotals({...poTotals, discountAmount: v})} colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Sales Tax (%)" type="number" value={poTotals.taxRate} onChange={(v) => setPoTotals({...poTotals, taxRate: v})} colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Sales Tax ($)" type="number" value={poTotals.taxAmount} onChange={(v) => setPoTotals({...poTotals, taxAmount: v})} colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Shipping & Handling ($)" type="number" value={poTotals.shippingCost} onChange={(v) => setPoTotals({...poTotals, shippingCost: v})} colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Other Cost ($)" type="number" value={poTotals.otherCost} onChange={(v) => setPoTotals({...poTotals, otherCost: v})} colors={colors} getInputStyle={getInputStyle} />
          </div>
          
          

          <div style={{ borderTop: "1px solid #4a5568", paddingTop: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ opacity: 0.8 }}>Subtotal:</span><span>${poTotals.subtotal}</span>
            </div>

            

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #4a5568" }}>
              <span style={{ fontWeight: "bold" }}>Grand Total:</span>
              <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#48bb78" }}>${poTotals.grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


function InputField({ label, value, onChange, placeholder, type = "text", colors, getInputStyle }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#718096", textTransform: "uppercase" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={getInputStyle(focused)}
      />
    </div>
  );
}
