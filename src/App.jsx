import { useSearchParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react"; 
import snapcopyLogo from "./assets/snapcopyLogo.png";
import airStadtLogo from "./assets/AirStadtLogo.png";
import InterestForm from "./pages/InterestForm"; 

function HomePage() {
  
  const [mode, setMode] = useState("about");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [years, setYears] = useState("");
  
  const [businessType, setBusinessType] = useState("");
  const [tone, setTone] = useState("");
  const [description, setDescription] = useState(""); // Used for Responder

  const [issueType, setIssueType] = useState(""); 
  const [apologyContext, setApologyContext] = useState(""); // Dedicated Apology State
  
  const [rawComments, setRawComments] = useState("");

  // --- NEW STATE FOR PURCHASE ORDER ---
  const [partNumber, setPartNumber] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [customVendor, setCustomVendor] = useState("");
  // -------------------------------------

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [searchParams] = useSearchParams();

useEffect(() => {
  const urlMode = searchParams.get("mode");
  // Updated allowedModes to include 'po'
  const allowedModes = ["about", "responder", "apology", "sentiment", "po"];

  if (urlMode && allowedModes.includes(urlMode.toLowerCase())) {
    setMode(urlMode.toLowerCase());
  }
}, []);


  const formRef = useRef(null);

  useEffect(() => {
    document.title = "SnapCopy | AI Content Toolkit for Small Businesses";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Instant AI-powered About Us bios, social media responses, and sentiment analysis for contractors and service businesses.");
    }
  }, []);

  const colors = {
    deepBlue: "#860aa5",
    purple: "#390b64",
    orange: "#ff8c00",
    darkSlate: "#2d3748", 
    lightGray: "#e2e8f0",
    textDark: "#1a202c",
    errorRed: "#e53e3e",
    successGreen: "#38a169",
    footerText: "#718096",
    poGreen: "#2d6a4f" // New color for PO Tab
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
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
  const allowedModes = ["about", "responder", "apology", "sentiment", "po"];
  const finalMode = allowedModes.includes(newMode) ? newMode : "about";

  setIndustry(""); 
  setCity(""); 
  setYears("");
  setBusinessType(""); 
  setTone(""); 
  setDescription("");
  setIssueType(""); 
  setApologyContext("");
  setRawComments(""); 
  // Reset PO Fields
  setPartNumber("");
  setExpectedPrice("");
  setPartDescription("");
  setVendorName("");
  setQuantity("");
  
  setOutput(""); 
  setError("");
  setCopied(false); 

  setMode(finalMode);
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
    console.log("FRONTEND SENDING MODE:", mode);
    setOutput(""); setError(""); setCopied(false);
    
    // 1. Validation Logic (Updated for PO)
    if (mode === "about") {
        if (!industry.trim() || !city.trim() || !years.trim()) {
            setError("Please fill out all About Us fields"); return;
        }
    } else if (mode === "responder") {
        if (!businessType || !tone) {
            setError("Please select a Business Type and Tone"); return;
        }
    } else if (mode === "apology") {
        if (!issueType || !apologyContext.trim()) {
            setError("Apology Error: Please select an issue type and provide context."); return;
        }
    } else if (mode === "sentiment") {
        if (!rawComments.trim()) {
            setError("Please paste content to analyze."); return;
        }
    } else if (mode === "po") {
    // Check if vendor is selected OR custom vendor is typed in
    const finalVendor = vendorName === "custom" ? customVendor : vendorName;
    if (!partNumber.trim() || !expectedPrice.trim() || !finalVendor.trim()) {
        setError("Please fill out Part #, Price, and Vendor for the PO."); return;
    }
}
    
    setLoading(true);

    // 2. Payload Construction
    let payload = { mode: mode.toLowerCase().trim() };

    if (mode === "about") {
        payload = { ...payload, industry, city, years };
    } else if (mode === "responder") {
        payload = { ...payload, businessType, tone, description };
    } else if (mode === "apology") {
        payload = { ...payload, issueType, apologyContext };
    } else if (mode === "sentiment") {
        payload = { ...payload, rawComments };
    } else if (mode === "po") {
    const finalVendor = vendorName === "custom" ? customVendor : vendorName;
    payload = { ...payload, partNumber, expectedPrice, partDescription, vendorName: finalVendor, quantity };
}

    try {
      const response = await fetch("https://api.snapcopy.online/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || `Server error: ${response.status}`);
      
      // 3. Mapping data keys (Updated for PO)
      const result = 
        mode === "about" ? data.about : 
        mode === "responder" ? data.reply : 
        mode === "apology" ? data.apology : 
        mode === "sentiment" ? data.sentiment : 
        data.po; // Backend should return PDF download link or PO text under 'po'

      setOutput(result);
    } catch (err) {
      setError(err.message || "Could not reach the AI backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ 
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: "100vh", width: "100vw", background: "#f0f2f5",
      padding: "20px", paddingTop: "10px", boxSizing: "border-box",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>

      {/* --- HERO SECTION --- */}
      <section aria-label="SnapCopy Hero" style={{ 
        width: "100%", maxWidth: 1000, textAlign: "center", 
        padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center" 
      }}>
        <div style={{ width: 180, height: 180, marginBottom: "20px" }}>
          <img src={snapcopyLogo} alt="SnapCopy Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        </div>
        <h1 style={{ 
          fontSize: "48px", fontWeight: "800", marginBottom: "15px", paddingBottom: "10px",
          background: `linear-gradient(to right, ${colors.deepBlue}, ${colors.purple})`, 
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          The Complete AI Content Toolkit for Growing Businesses
        </h1>
        <p style={{ fontSize: "18px", color: "#4a5568", maxWidth: "700px", lineHeight: "1.6", marginBottom: "30px" }}>
          From professional "About Us" bios to social media management and sentiment analysis. SnapCopy is your all-in-one suite for high-impact content.
        </p>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
          <button 
            onClick={scrollToForm}
            aria-label="Explore tools"
            style={{ 
              padding: "16px 32px", background: colors.deepBlue, color: "white", 
              border: "none", borderRadius: "50px", fontWeight: "bold", fontSize: "18px",
              cursor: "pointer", boxShadow: "0 10px 20px rgba(134, 10, 165, 0.2)"
            }}
          >
            Explore Tools
          </button>
        </div>
      </section>

      {/* --- EXPLANATION & EXAMPLE SECTION --- */}
      <section aria-label="About SnapCopy Toolkit" style={{ 
        width: "100%", maxWidth: 1000, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "40px", padding: "40px 20px", marginBottom: "40px" 
      }}>
        <div>
          <h2 style={{ color: colors.purple, fontSize: "24px" }}>The SnapCopy Toolkit</h2>
          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            We provide a growing ecosystem of AI tools designed for service businesses. Whether you're building a brand bio, responding to social engagement, or analyzing customer feedback, we turn complex tasks into "Snaps."
          </p>
          <h2 style={{ color: colors.purple, fontSize: "24px", marginTop: "30px" }}>Built for Growth</h2>
          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            Our engine is constantly evolving. We're adding new modules regularly to help you automate your marketing and focus on what you do best: running your business.
          </p>
        </div>

        <div style={{ 
          background: "white", padding: "25px", borderRadius: "15px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: `1px solid ${colors.lightGray}` 
        }}>
          <h3 style={{ fontSize: "14px", color: colors.deepBlue, textTransform: "uppercase", marginBottom: "15px" }}>Current Capabilities</h3>
          <ul style={{ color: "#4a5568", fontSize: "15px", paddingLeft: "20px", lineHeight: "2" }}>
            <li><b>About Us:</b> SEO-ready business bios.</li>
            <li><b>Responder:</b> Engaging social media captions.</li>
            <li><b>Apology:</b> Polished customer resolution writing.</li>
            <li><b>Sentiment:</b> Deep emotional feedback analysis.</li>
            <li><b style={{ color: colors.poGreen }}>PO Generator:</b> Instant PDF Purchase Orders.</li>
          </ul>
        </div>
      </section>

      {/* --- WHO THIS IS FOR --- */}
      <section aria-label="Target Audience" style={{ width: "100%", maxWidth: 1000, textAlign: "center", marginBottom: "60px" }}>
        <h2 style={{ color: colors.textDark, marginBottom: "20px" }}>Who This Is For</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
          {["Contractors", "Home Service Businesses", "Freelancers", "Small Business Owners", "Agencies"].map((item) => (
            <span key={item} style={{ padding: "8px 20px", background: "white", borderRadius: "50px", border: `1px solid ${colors.lightGray}`, color: colors.purple, fontWeight: "600", fontSize: "14px" }}>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* --- MAIN APP SECTION --- */}
      <div ref={formRef} style={{ width: "100%", maxWidth: 800 }}>
        <Link to="/interest" style={{ textDecoration: "none", marginBottom: "20px", display: "block" }}>
           <button 
             style={{ 
               width: "100%", padding: "12px", background: "white", color: colors.deepBlue, 
               border: `2px solid ${colors.deepBlue}`, borderRadius: "8px", fontWeight: "bold", 
               cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" 
             }}>
             Interested in SnapCopy or SnapMatrix? Join the waitlist today.
           </button>
        </Link>

        {/* --- NAVIGATION TABS --- */}
        <nav style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap" }}>
          <button onClick={() => handleModeSwitch("about")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "about" ? colors.deepBlue : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>About Us</button>
          <button onClick={() => handleModeSwitch("responder")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "responder" ? colors.purple : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Responder</button>
          <button onClick={() => handleModeSwitch("apology")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "apology" ? colors.orange : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Apology</button>
          <button onClick={() => handleModeSwitch("sentiment")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "sentiment" ? colors.darkSlate : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Sentiment</button>
          {/* NEW PO TAB BUTTON */}
          <button onClick={() => handleModeSwitch("po")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "po" ? colors.poGreen : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>PO Generator</button>
        </nav>

        <div style={{ background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <header style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "36px", margin: 0, fontWeight: "800", background: mode === "po" ? colors.poGreen : `linear-gradient(to right, ${colors.deepBlue}, ${colors.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {mode === "about" ? "About Us Snap" : mode === "responder" ? "Responder Snap" : mode === "apology" ? "Apology Snap" : mode === "sentiment" ? "Sentiment Snap" : "Purchase Order Snap"}
            </h2>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: mode === "po" ? colors.poGreen : colors.deepBlue, textTransform: "uppercase", letterSpacing: "2px" }}>
              {mode === "sentiment" ? "AI Feedback Analysis" : mode === "po" ? "PDF Generation" : "AI Powered Content"}
            </p>
          </header>

          {/* --- INSTRUCTIONS --- */}
          {mode === "about" && (
            <div style={instructionStyle}>
              <strong>Instructions:</strong> Enter your industry, city, and years of experience. SnapCopy will generate a professional "About Us" bio.
            </div>
          )}
          {mode === "responder" && (
            <div style={instructionStyle}>
              <strong>Instructions:</strong> Select your business type and tone. SnapCopy will generate captions, hashtags, and CTAs.
            </div>
          )}
          {mode === "apology" && (
            <div style={instructionStyle}>
              <strong>Instructions:</strong> Select the issue type and provide context. SnapCopy writes a polished apology to preserve your brand.
            </div>
          )}
          {mode === "sentiment" && (
            <div style={instructionStyle}>
              <strong>Instructions:</strong> Start at the top of the comments section, copy everything, and paste it here. SnapCopy will analyze the overall mood.
            </div>
          )}
          {/* NEW PO INSTRUCTIONS */}
          {mode === "po" && (
            <div style={{ ...instructionStyle, borderLeftColor: colors.poGreen }}>
              <strong>Instructions:</strong> Enter the part details and vendor information. SnapCopy will generate a professional PDF Purchase Order for your records.
            </div>
          )}

          {/* --- INPUT FIELDS --- */}
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
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Business Type</label>
                <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} style={inputStyle}>
                  <option value="">Select a type...</option>
                  <optgroup label="Popular">
                    <option value="landscaper">Landscaper</option>
                    <option value="realtor">Realtor</option>
                    <option value="barber">Barber</option>
                    <option value="hvac">HVAC</option>
                    <option value="dentist">Dentist</option>
                    <option value="developer">Developer</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} style={inputStyle}>
                  <option value="">Select a tone...</option>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="bold">Bold</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <InputField label="Short Description (Optional)" value={description} onChange={setDescription} placeholder="What is this post about?" colors={colors} getInputStyle={getInputStyle} />
            </div>
          )}

          {mode === "apology" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Issue Type</label>
                <select value={issueType} onChange={(e) => setIssueType(e.target.value)} style={inputStyle}>
                  <option value="">What went wrong?</option>
                  <option value="missed appointment">Missed Appointment</option>
                  <option value="delay">Delay</option>
                  <option value="mistake">Mistake</option>
                  <option value="miscommunication">Miscommunication</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Context / Details</label>
                <textarea 
                  value={apologyContext} 
                  onChange={(e) => setApologyContext(e.target.value)} 
                  placeholder="Provide context (e.g., 'Technician was sick', 'Software bug')..." 
                  style={{ ...inputStyle, height: "100px", resize: "none" }} 
                />
              </div>
            </div>
          )}

          {mode === "sentiment" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Paste Content / Comments</label>
              <textarea value={rawComments} onChange={(e) => setRawComments(e.target.value)} placeholder="Paste comments here..." style={{ ...inputStyle, height: "150px", resize: "none" }} />
            </div>
          )}

          {/* --- NEW PO INPUT FIELDS --- */}
          {mode === "po" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <InputField label="Part Number" value={partNumber} onChange={setPartNumber} placeholder="SKU-12345" colors={colors} getInputStyle={getInputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                   <InputField label="Quantity" value={quantity} onChange={setQuantity} placeholder="1" type="number" colors={colors} getInputStyle={getInputStyle} />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Select Vendor</label>
                <select 
                  value={vendorName} 
                  onChange={(e) => {
                    setVendorName(e.target.value);
                    if (e.target.value !== "custom") setCustomVendor(""); // Clear custom if switching back
                  }} 
                  style={inputStyle}
                >
                  <option value="">Choose a Vendor...</option>
                  <option value="Global Supply Co">Global Supply Co</option>
                  <option value="TechParts Inc">TechParts Inc</option>
                  <option value="AirStadt Logistics">AirStadt Logistics</option>
                  <option value="Local Hardware Hub">Local Hardware Hub</option>
                  <option value="custom">-- Add Custom Vendor --</option>
                </select>
              </div>

              {/* CONDITIONAL CUSTOM VENDOR INPUT */}
                {vendorName === "custom" && (
                  <div style={{ marginTop: "10px" }}>
                    <InputField 
                      label="Custom Vendor Name" 
                      value={customVendor} 
                      onChange={setCustomVendor} 
                      placeholder="Enter vendor name..." 
                      colors={colors} 
                      getInputStyle={getInputStyle} 
                    />
                  </div>
                )}

              <InputField label="Expected Price ($)" value={expectedPrice} onChange={setExpectedPrice} placeholder="99.99" type="number" colors={colors} getInputStyle={getInputStyle} />
              
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Part Description</label>
                <textarea 
                  value={partDescription} 
                  onChange={(e) => setPartDescription(e.target.value)} 
                  placeholder="Details about the item being ordered..." 
                  style={{ ...inputStyle, height: "80px", resize: "none" }} 
                />
              </div>
            </div>
          )}

          <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "15px", background: mode === "po" ? colors.poGreen : `linear-gradient(135deg, ${colors.deepBlue}, ${colors.purple})`, color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginTop: "20px" }}>
            {loading ? "Processing..." : mode === "po" ? "Generate PDF PO" : "Run Snap"}
          </button>

          {error && <div style={{ color: colors.errorRed, marginTop: "15px", textAlign: "center", fontSize: "14px", backgroundColor: "#fff5f5", padding: "10px", borderRadius: "8px" }}>{error}</div>}

          {output && (
            <div style={{ marginTop: "30px", borderTop: `1px solid ${colors.lightGray}`, paddingTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "14px", color: mode === "po" ? colors.poGreen : colors.deepBlue, margin: 0 }}>Result:</h3>
                <button onClick={copyToClipboard} style={{ padding: "6px 12px", background: copied ? colors.successGreen : (mode === "po" ? colors.poGreen : colors.deepBlue), color: "white", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <textarea value={output} readOnly style={{ width: "100%", height: "250px", padding: "15px", borderRadius: "12px", border: `1px solid ${colors.lightGray}`, backgroundColor: "#f8fafc", fontSize: "14px", lineHeight: "1.6", color: colors.textDark, resize: "none" }} />
            </div>
          )}
        </div>
      </div>

      <footer style={{ marginTop: "auto", width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px 0", borderTop: `1px solid ${colors.lightGray}88` }}>
        <img src={airStadtLogo} alt="AirStadt Logo" style={{ height: "30px", width: "auto" }} />
        <p style={{ fontSize: "13px", color: colors.footerText, margin: 0 }}>&copy; {new Date().getFullYear()} AirStadt. All rights reserved.</p>
      </footer>
    </main>
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