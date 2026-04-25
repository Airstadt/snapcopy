import React, { useState } from "react";

export default function JobEstimator({ colors, inputStyle, getInputStyle, onDownload }) {
  const [header, setHeader] = useState({
    jobTitle: "", customerName: "", contactInfo: "", location: "", 
    description: "", category: "", status: "Estimate", dueDate: ""
  });

  const [tasks, setTasks] = useState([{ desc: "", type: "Hourly", rate: 0, qty: 1, taxable: false }]);
  const [materials, setMaterials] = useState([{ desc: "", qty: 1, cost: 0, taxable: true }]);
  const [fees, setFees] = useState([{ type: "Travel Fee", amount: 0 }]);
  const [financials, setFinancials] = useState({ deposit: 0, discount: 0, taxRate: 8, terms: "Due on Receipt" });

  const addItem = (list, setList, template) => setList([...list, template]);
  const updateItem = (index, field, value, list, setList) => {
    const newLines = [...list];
    newLines[index][field] = value;
    setList(newLines);
  };

  const calculateTotal = () => {
    const labor = tasks.reduce((sum, t) => sum + (parseFloat(t.rate || 0) * parseFloat(t.qty || 0)), 0);
    const mats = materials.reduce((sum, m) => sum + (parseFloat(m.cost || 0) * parseFloat(m.qty || 0)), 0);
    const addOns = fees.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
    const subtotal = labor + mats + addOns;
    const afterDiscount = subtotal - parseFloat(financials.discount || 0);
    const tax = afterDiscount * (parseFloat(financials.taxRate || 0) / 100);
    return (afterDiscount + tax).toFixed(2);
  };

  const handleDownload = () => {
    const total = calculateTotal();
    const estimateData = {
      header,
      tasks,
      materials,
      fees,
      financials,
      total
    };
    if (onDownload) {
      onDownload(estimateData);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. HEADER DETAILS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "10px", fontWeight: "bold" }}>Job Title / Project</label>
          <input type="text" placeholder="Kitchen Remodel" style={inputStyle} value={header.jobTitle} onChange={e => setHeader({...header, jobTitle: e.target.value})} />
        </div>
        <div>
          <label style={{ fontSize: "10px", fontWeight: "bold" }}>Customer Name</label>
          <input type="text" placeholder="John Doe" style={inputStyle} value={header.customerName} onChange={e => setHeader({...header, customerName: e.target.value})} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "10px", fontWeight: "bold" }}>Location</label>
          <input type="text" placeholder="Richmond, VA" style={inputStyle} value={header.location} onChange={e => setHeader({...header, location: e.target.value})} />
        </div>
        <div>
          <label style={{ fontSize: "10px", fontWeight: "bold" }}>Due Date / Expected Start</label>
          <input type="date" style={inputStyle} value={header.dueDate} onChange={e => setHeader({...header, dueDate: e.target.value})} />
        </div>
      </div>

      {/* 2. LABOR / TASKS */}
      <div style={{ border: `1px solid ${colors.lightGray}`, padding: "15px", borderRadius: "10px" }}>
        <h4 style={{ fontSize: "14px", color: colors.deepBlue, marginBottom: "10px" }}>Labor & Tasks</h4>
        {tasks.map((task, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 1fr 40px", gap: "10px", marginBottom: "10px" }}>
            <input type="text" placeholder="Task description" style={inputStyle} value={task.desc} onChange={e => updateItem(i, "desc", e.target.value, tasks, setTasks)} />
            <select style={inputStyle} value={task.type} onChange={e => updateItem(i, "type", e.target.value, tasks, setTasks)}>
              <option>Hourly</option>
              <option>Flat Rate</option>
            </select>
            <input type="number" placeholder="Rate" style={inputStyle} value={task.rate} onChange={e => updateItem(i, "rate", e.target.value, tasks, setTasks)} />
            <input type="number" placeholder="Qty/Hrs" style={inputStyle} value={task.qty} onChange={e => updateItem(i, "qty", e.target.value, tasks, setTasks)} />
            <button onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))} style={{ background: colors.errorRed, color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <button onClick={() => addItem(tasks, setTasks, { desc: "", type: "Hourly", rate: 0, qty: 1, taxable: false })} style={{ background: colors.deepBlue, color: "white", border: "none", padding: "5px 15px", borderRadius: "5px", fontSize: "12px", cursor: "pointer" }}>+ Add Task</button>
      </div>

      {/* 3. MATERIALS */}
      <div style={{ border: `1px solid ${colors.lightGray}`, padding: "15px", borderRadius: "10px" }}>
        <h4 style={{ fontSize: "14px", color: colors.deepBlue, marginBottom: "10px" }}>Materials</h4>
        {materials.map((mat, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 40px", gap: "10px", marginBottom: "10px" }}>
            <input type="text" placeholder="Material item" style={inputStyle} value={mat.desc} onChange={e => updateItem(i, "desc", e.target.value, materials, setMaterials)} />
            <input type="number" placeholder="Qty" style={inputStyle} value={mat.qty} onChange={e => updateItem(i, "qty", e.target.value, materials, setMaterials)} />
            <input type="number" placeholder="Cost" style={inputStyle} value={mat.cost} onChange={e => updateItem(i, "cost", e.target.value, materials, setMaterials)} />
            <button onClick={() => setMaterials(materials.filter((_, idx) => idx !== i))} style={{ background: colors.errorRed, color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>×</button>
          </div>
        ))}
        <button onClick={() => addItem(materials, setMaterials, { desc: "", qty: 1, cost: 0, taxable: true })} style={{ background: colors.deepBlue, color: "white", border: "none", padding: "5px 15px", borderRadius: "5px", fontSize: "12px", cursor: "pointer" }}>+ Add Material</button>
      </div>

      {/* 4. FEES & ADJUSTMENTS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        {fees.map((fee, i) => (
          <div key={i} style={{ display: "flex", gap: "10px" }}>
            <input type="text" placeholder="Fee Type" style={inputStyle} value={fee.type} onChange={e => updateItem(i, "type", e.target.value, fees, setFees)} />
            <input type="number" placeholder="Amount" style={inputStyle} value={fee.amount} onChange={e => updateItem(i, "amount", e.target.value, fees, setFees)} />
          </div>
        ))}
      </div>

      {/* 5. TOTALS & PDF DOWNLOAD */}
      <div style={{ background: colors.lightGray, padding: "20px", borderRadius: "10px", marginTop: "10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label style={{ fontSize: "10px", fontWeight: "bold" }}>Discount ($)</label>
            <input type="number" style={inputStyle} value={financials.discount} onChange={e => setFinancials({...financials, discount: e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize: "10px", fontWeight: "bold" }}>Tax Rate (%)</label>
            <input type="number" style={inputStyle} value={financials.taxRate} onChange={e => setFinancials({...financials, taxRate: e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize: "10px", fontWeight: "bold" }}>Payment Terms</label>
            <select style={inputStyle} value={financials.terms} onChange={e => setFinancials({...financials, terms: e.target.value})}>
              <option>Due on Receipt</option>
              <option>Net 7</option>
              <option>Net 15</option>
              <option>Net 30</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid rgba(0,0,0,0.1)`, paddingTop: "15px" }}>
          <button 
            onClick={handleDownload}
            style={{ 
              background: colors.deepBlue, 
              color: "white", 
              border: "none", 
              padding: "12px 25px", 
              borderRadius: "8px", 
              fontWeight: "bold", 
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            Download Estimate PDF
          </button>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: colors.textDark }}>Estimated Total: </span>
            <span style={{ fontSize: "24px", fontWeight: "900", color: colors.deepBlue }}>${calculateTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}