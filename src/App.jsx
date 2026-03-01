import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import snapcopyLogo from "./assets/snapcopyLogo.png";
import airStadtLogo from "./assets/AirStadtLogo.png";
import InterestForm from "./pages/InterestForm"; 

function HomePage() {
  const [mode, setMode] = useState("about");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [years, setYears] = useState("");
  
  // NEW RESPONDER STATE ONLY
  const [businessType, setBusinessType] = useState("");
  const [tone, setTone] = useState("");
  const [description, setDescription] = useState("");
  
  const [rawComments, setRawComments] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const colors = {
    deepBlue: "#860aa5",
    purple: "#390b64",
    darkSlate: "#2d3748", 
    lightGray: "#e2e8f0",
    textDark: "#1a202c",
    errorRed: "#e53e3e",
    successGreen: "#38a169",
    footerText: "#718096"
  };

  const instructionStyle = {
    fontSize: "13px",
    color: "#4a5568",
    backgroundColor: "#f7fafc",
    padding: "12px",
    borderRadius: "8px",
    borderLeft: `4px solid ${colors.deepBlue}`,
    marginBottom: "20px",
    lineHeight: "1.5"
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
    borderColor: isFocused ? colors.deepBlue : colors.lightGray,
    boxShadow: isFocused ? `0 0 0 3px ${colors.deepBlue}33` : "none",
  });

  const handleModeSwitch = (newMode) => {
    // Clear all fields to prevent cross-over
    setIndustry(""); setCity(""); setYears("");
    setBusinessType(""); setTone(""); setDescription("");
    setRawComments(""); setOutput(""); setError("");
    setCopied(false); setMode(newMode);
  };

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

  async function generate() {
    setOutput(""); setError(""); setCopied(false);
    
    // STRICT FRONTEND VALIDATION
    if (mode === "about" && (!industry.trim() || !city.trim() || !years.trim())) {
      setError("Please fill out all About Us fields"); return;
    } else if (mode === "responder" && (!businessType || !tone)) {
      setError("Please select a Business Type and Tone"); return;
    } else if (mode === "sentiment" && !rawComments.trim()) {
      setError("Please paste the page content or comments"); return;
    }
    
    setLoading(true);
    let payload = { mode };
    
    if (mode === "about") {
      payload = { ...payload, industry, city, years };
    } else if (mode === "responder") {
      // Only sending the 3 required fields for the new Responder
      payload = { ...payload, businessType, tone, description };
    } else {
      payload = { ...payload, rawComments };
    }

    try {
      const response = await fetch("https://api.snapcopy.online/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // This is likely where your "Please fill out fields" error is coming from (the server)
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      
      const result = mode === "about" ? data.about : (mode === "responder" ? data.reply : data.sentiment);
      setOutput(result);
    } catch (err) {
      setError(err.message || "Could not reach the AI backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: "100vh", width: "100vw", background: "#f0f2f5",
      padding: "20px", paddingTop: "10px", boxSizing: "border-box",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>

      <div style={{ width: 250, height: 250, display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: "20px" }}>
        <img src={snapcopyLogo} alt="SnapCopy Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
      </div>

      <Link to="/interest" style={{ textDecoration: "none", marginBottom: "20px", width: "100%", maxWidth: 800 }}>
         <button style={{ 
           width: "100%", padding: "12px", background: "white", color: colors.deepBlue, 
           border: `2px solid ${colors.deepBlue}`, borderRadius: "8px", fontWeight: "bold", 
           cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" 
         }}>
           Get on the list for full and custom access to SnapCopy!
         </button>
      </Link>

      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", width: "100%", maxWidth: 800 }}>
        <button onClick={() => handleModeSwitch("about")} style={{ flex: 1, padding: "12px", background: mode === "about" ? colors.deepBlue : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>About Us</button>
        <button onClick={() => handleModeSwitch("responder")} style={{ flex: 1, padding: "12px", background: mode === "responder" ? colors.purple : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Responder</button>
        <button onClick={() => handleModeSwitch("sentiment")} style={{ flex: 1, padding: "12px", background: mode === "sentiment" ? colors.darkSlate : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Sentiment</button>
      </div>

      <div style={{ width: "100%", maxWidth: 800, background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "36px", margin: 0, fontWeight: "800", background: `linear-gradient(to right, ${colors.deepBlue}, ${colors.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {mode === "about" ? "About Us Snap" : mode === "responder" ? "Responder Snap" : "Sentiment Snap"}
          </h1>
          <p style={{ fontSize: "12px", fontWeight: "bold", color: colors.deepBlue, textTransform: "uppercase", letterSpacing: "2px" }}>
            {mode === "sentiment" ? "AI Feedback Analysis" : "AI Powered Content"}
          </p>
        </div>

        {/* --- INSTRUCTIONS SECTION --- */}
        {mode === "about" && (
          <div style={instructionStyle}>
            <strong>Instructions:</strong> Enter your industry, city, and years of experience. SnapCopy will generate a professional "About Us" bio perfect for your website or profile.
          </div>
        )}
        {mode === "responder" && (
          <div style={instructionStyle}>
            <strong>Instructions:</strong> Select your business type and tone. Add a short description of the post if you like. SnapCopy will generate 5 captions, 5 hashtags, 3 ideas, and 1 CTA.
          </div>
        )}
        {mode === "sentiment" && (
          <div style={instructionStyle}>
            <strong>Instructions:</strong> Drag and copy an entire page of comments. SnapCopy will filter out the junk, analyze the overall mood, and give you clear emotional insights about the post. 
          </div>
        )}

        {/* Form Inputs based on mode */}
        {mode === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <InputField label="Industry" value={industry} onChange={setIndustry} placeholder="HVAC, Roofing..." colors={colors} getInputStyle={getInputStyle} />
            <InputField label="City" value={city} onChange={setCity} placeholder="Richmond, VA" colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Years of Experience" value={years} onChange={setYears} placeholder="10" type="number" colors={colors} getInputStyle={getInputStyle} />
          </div>
        )}

        {mode === "responder" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Business or Topic Type</label>
              <select 
                value={businessType} 
                onChange={(e) => setBusinessType(e.target.value)} 
                style={inputStyle}
              >
                <option value="">Select a type...</option>
                <option value="landscaper">Landscaper</option>
                <option value="realtor">Realtor</option>
                <option value="barber">Barber</option>
                <option value="hvac">HVAC</option>
                <option value="dentist">Dentist</option>
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Tone</label>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value)} 
                style={inputStyle}
              >
                <option value="">Select a tone...</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="bold">Bold</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <InputField 
              label="Short Description (Optional)" 
              value={description} 
              onChange={setDescription} 
              placeholder="What is this post about?" 
              colors={colors} 
              getInputStyle={getInputStyle} 
            />
          </div>
        )}

        {mode === "sentiment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Paste Content / Comments</label>
            <textarea value={rawComments} onChange={(e) => setRawComments(e.target.value)} placeholder="Paste comments here..." style={{ ...inputStyle, height: "150px", resize: "none" }} />
          </div>
        )}

        <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${colors.deepBlue}, ${colors.purple})`, color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginTop: "20px" }}>
          {loading ? "Analyzing..." : "Run Snap"}
        </button>

        {error && <div style={{ color: colors.errorRed, marginTop: "15px", textAlign: "center", fontSize: "14px", backgroundColor: "#fff5f5", padding: "10px", borderRadius: "8px" }}>{error}</div>}

        {output && (
          <div style={{ marginTop: "30px", borderTop: `1px solid ${colors.lightGray}`, paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ fontSize: "14px", color: colors.deepBlue, margin: 0 }}>Result:</h3>
              <button onClick={copyToClipboard} style={{ padding: "6px 12px", background: copied ? colors.successGreen : colors.deepBlue, color: "white", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea value={output} readOnly style={{ width: "100%", height: "250px", padding: "15px", borderRadius: "12px", border: `1px solid ${colors.lightGray}`, backgroundColor: "#f8fafc", fontSize: "14px", lineHeight: "1.6", color: colors.textDark, resize: "none" }} />
          </div>
        )}
      </div>

      <footer style={{ marginTop: "auto", width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px 0", borderTop: `1px solid ${colors.lightGray}88` }}>
        <img src={airStadtLogo} alt="AirStadt Logo" style={{ height: "30px", width: "auto" }} />
        <p style={{ fontSize: "13px", color: colors.footerText, margin: 0 }}>&copy; {new Date().getFullYear()} AirStadt. All rights reserved.</p>
      </footer>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", colors, getInputStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>{label}</label>
      <input
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={getInputStyle(focused)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interest" element={<InterestForm />} />
      </Routes>
    </Router>
  );
}