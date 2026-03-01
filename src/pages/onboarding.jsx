// src/pages/onboarding.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  // --- CLIENT ONBOARDING FORM STATE ---
  const [jobDate, setJobDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerState, setCustomerState] = useState("");
  const [customerZip, setCustomerZip] = useState("");
  const [companyLocations, setCompanyLocations] = useState("");
  const [jobStartDate, setJobStartDate] = useState("");
  const [jobStartTime, setJobStartTime] = useState("");
  const [jobCompletionDate, setJobCompletionDate] = useState("");
  const [jobCompletionTime, setJobCompletionTime] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobPriority, setJobPriority] = useState("Medium");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [assignedTeam, setAssignedTeam] = useState("");
  const [requiredMaterials, setRequiredMaterials] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");

  // --- SHARED STATE ---
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const colors = {
    primary: "#d97706",
    secondary: "#b45309",
    lightGray: "#e2e8f0",
    textDark: "#1a202c",
    errorRed: "#e53e3e",
    successGreen: "#38a169",
    sectionBg: "#f8fafc"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    borderRadius: "8px",
    border: `1px solid ${colors.lightGray}`,
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const getInputStyle = (isFocused) => ({
    ...inputStyle,
    borderColor: isFocused ? colors.primary : colors.lightGray,
    boxShadow: isFocused ? `0 0 0 3px ${colors.primary}33` : "none",
  });

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const clearForm = () => {
    setJobDate(""); setCustomerName(""); setCustomerCompany(""); setCustomerEmail("");
    setCustomerPhone(""); setCustomerAddress(""); setCustomerCity(""); setCustomerState("");
    setCustomerZip(""); setCompanyLocations(""); setJobStartDate(""); setJobStartTime("");
    setJobCompletionDate(""); setJobCompletionTime(""); setJobType(""); setJobPriority("Medium");
    setEstimatedHours(""); setEstimatedCost(""); setJobDescription(""); setSpecialInstructions("");
    setAssignedTeam(""); setRequiredMaterials(""); setPaymentTerms(""); setNotes("");
    setOutput(""); setError(""); setCopied(false);
  };

  async function generate() {
    setOutput(""); setError(""); setCopied(false);
    if (!jobDate || !customerName || !customerEmail || !customerAddress || !jobType || !jobDescription) {
      setError("Please fill out all required fields marked with *");
      return;
    }
    setLoading(true);
    const payload = {
      mode: "onboarding", jobDate, customerName, customerCompany, customerEmail, customerPhone,
      customerAddress, customerCity, customerState, customerZip, companyLocations, jobStartDate, 
      jobStartTime, jobCompletionDate, jobCompletionTime, jobType, jobPriority, estimatedHours, 
      estimatedCost, jobDescription, specialInstructions, assignedTeam, requiredMaterials, 
      paymentTerms, notes
    };

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Server error: ${response.status}`);
      setOutput(data.onboarding);
    } catch (err) {
      setError(err.message || "Could not reach the AI backend.");
    } finally {
      setLoading(false);
    }
  }

  const fillSampleData = () => {
    const today = new Date().toISOString().split('T')[0];
    setJobDate(today);
    setCustomerName("John Smith");
    setCustomerEmail("john@example.com");
    setCustomerPhone("(555) 123-4567");
    setCustomerAddress("456 Business Ave");
    setCustomerCity("Austin");
    setCustomerState("TX");
    setCustomerZip("78701");
    setJobType("HVAC Installation");
    setJobDescription("Full system install for commercial suite.");
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh",
      width: "100vw", background: "#f0f2f5", padding: "20px", boxSizing: "border-box",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>

      {/* --- BACK BUTTON --- */}
      <button 
        onClick={() => navigate("/")}
        style={{
          alignSelf: "flex-start", marginBottom: "20px", background: "none", border: "none",
          color: "#4a5568", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px"
        }}
      >
        ← Back to Main Tool
      </button>

      {/* --- Header --- */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h1 style={{
          fontSize: "32px", margin: 0, fontWeight: "800",
          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Client Onboarding
        </h1>
      </div>

      <div style={{
        width: "100%", maxWidth: 800, background: "white", padding: "25px",
        borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", marginBottom: "20px"
      }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <Section title="📋 Job Details" color={colors.primary}>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <FormField flex="1" minWidth="150px">
                <InputField label="Job Date *" value={jobDate} onChange={setJobDate} type="date" getInputStyle={getInputStyle} />
              </FormField>
              <FormField flex="1" minWidth="150px">
                <InputField label="Job Type *" value={jobType} onChange={setJobType} placeholder="Installation..." getInputStyle={getInputStyle} />
              </FormField>
              <FormField flex="1" minWidth="150px">
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Priority</label>
                <select value={jobPriority} onChange={(e) => setJobPriority(e.target.value)} style={getInputStyle(false)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </FormField>
            </div>
          </Section>

          <Section title="👤 Customer Information" color={colors.primary}>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "10px" }}>
              <FormField flex="1" minWidth="200px">
                <InputField label="Customer Name *" value={customerName} onChange={setCustomerName} placeholder="Full Name" getInputStyle={getInputStyle} />
              </FormField>
              <FormField flex="1" minWidth="200px">
                <InputField label="Email *" value={customerEmail} onChange={setCustomerEmail} type="email" getInputStyle={getInputStyle} />
              </FormField>
            </div>
            <InputField label="Address *" value={customerAddress} onChange={setCustomerAddress} placeholder="123 Street Ave" getInputStyle={getInputStyle} />
          </Section>

          <Section title="🔧 Scope of Work" color={colors.primary}>
            <TextAreaField label="Description *" value={jobDescription} onChange={setJobDescription} placeholder="What needs to be done?" getInputStyle={getInputStyle} />
          </Section>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={fillSampleData} style={{ padding: "10px 16px", background: "#4299e1", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Fill Sample</button>
            <button onClick={clearForm} style={{ padding: "10px 16px", background: "#a0aec0", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Clear</button>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: "100%", padding: "15px", marginTop: "25px",
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            color: "white", border: "none", borderRadius: "10px", fontSize: "16px",
            fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 15px rgba(217, 119, 6, 0.3)"
          }}
        >
          {loading ? "Generating..." : "Generate Onboarding Summary"}
        </button>

        {error && <div style={{ color: colors.errorRed, marginTop: "15px", textAlign: "center", fontWeight: "600" }}>{error}</div>}

        {output && (
          <div style={{ marginTop: "30px", borderTop: `1px solid ${colors.lightGray}`, paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <h3 style={{ fontSize: "16px", color: colors.primary, margin: 0 }}>Onboarding Summary</h3>
              <button onClick={copyToClipboard} style={{ background: copied ? colors.successGreen : colors.primary, color: "white", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea value={output} readOnly style={{ width: "100%", height: "250px", padding: "15px", borderRadius: "12px", border: `1px solid ${colors.lightGray}`, backgroundColor: colors.sectionBg, resize: "none" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// --- HELPERS ---
function Section({ title, color, children }) {
  return (
    <div style={{ backgroundColor: "#f8fafc", padding: "15px", borderRadius: "12px", border: "1px solid #edf2f7" }}>
      <h3 style={{ fontSize: "16px", color, marginTop: 0, marginBottom: "15px" }}>{title}</h3>
      {children}
    </div>
  );
}

function FormField({ flex, minWidth, children }) {
  return <div style={{ flex: flex || "none", minWidth: minWidth || "auto" }}>{children}</div>;
}

function InputField({ label, value, onChange, placeholder, type = "text", getInputStyle }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={getInputStyle(false)} />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, getInputStyle }) {
  return (
    <div>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...getInputStyle(false), minHeight: "100px", resize: "vertical" }} />
    </div>
  );
}