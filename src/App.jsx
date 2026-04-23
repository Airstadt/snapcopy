import { useSearchParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react"; 
import { jsPDF } from "jspdf"; 
import snapcopyLogo from "./assets/snapcopyLogo.png";
import airStadtLogo from "./assets/AirStadtLogo.png";
import InterestForm from "./pages/InterestForm"; 

function HomePage() {
  
  // --- STATE MANAGEMENT ---
  const [mode, setMode] = useState("about");
  
  // Basic Input States
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [years, setYears] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [customBusinessType, setCustomBusinessType] = useState("");
  const [tone, setTone] = useState("");
  const [description, setDescription] = useState(""); 
  const [issueType, setIssueType] = useState(""); 
  const [apologyContext, setApologyContext] = useState(""); 
  const [rawComments, setRawComments] = useState("");

  // --- PURCHASE ORDER STATE ---
  const [buyerInfo, setBuyerInfo] = useState({
    companyName: "", companyAddress: "", contactName: "", contactEmail: "", contactPhone: "", billingAddress: "", shippingAddress: ""
  });

  const [vendorInfo, setVendorInfo] = useState({
    vendorName: "", vendorContact: "", vendorEmail: "", vendorPhone: "", vendorAddress: "", vendorPaymentTerms: ""
  });

  const [poDetails, setPoDetails] = useState({
    poNumber: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
    poDate: new Date().toISOString().split("T"),
    deliveryDate: "", shippingMethod: "Ground", paymentTerms: "Net 30", notes: ""
  });

  const [poItems, setPoItems] = useState([
    { itemName: "", partNumber: "", quantity: 1, unitPrice: 0, unitOfMeasure: "pcs", taxable: false, discount: 0, lineNotes: "" }
  ]);

  const [poTotals, setPoTotals] = useState({ subtotal: 0, tax: 0, shippingCost: 0, grandTotal: 0 });

  // UI States
  const [output, setOutput] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const [copied, setCopied] = useState(false); 

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    const allowedModes = ["about", "responder", "apology", "sentiment", "po"];
    if (urlMode && allowedModes.includes(urlMode.toLowerCase())) {
      setMode(urlMode.toLowerCase());
    }
  }, [searchParams]);

  // --- AUTO-CALCULATION LOGIC ---
  useEffect(() => {
    if (mode === "po") {
      const subtotal = poItems.reduce((acc, item) => {
        const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
        const lineDiscount = parseFloat(item.discount) || 0;
        return acc + (lineTotal - lineDiscount);
      }, 0);

      const taxRate = 0.08; 
      const taxableAmount = poItems.filter(i => i.taxable).reduce((acc, item) => {
        return acc + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0));
      }, 0);

      const tax = taxableAmount * taxRate;
      const shipping = parseFloat(poTotals.shippingCost) || 0;
      
      setPoTotals(prev => ({
        ...prev,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        grandTotal: (subtotal + tax + shipping).toFixed(2)
      }));
    }
  }, [poItems, poTotals.shippingCost, mode]);

  const formRef = useRef(null);

  useEffect(() => {
    document.title = "SnapCopy | AI Content Toolkit for Small Businesses";
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
    poGreen: "#2d6a4f" 
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
  };

  const getInputStyle = (isFocused) => ({
    ...inputStyle,
    borderColor: isFocused ? (mode === "po" ? colors.poGreen : colors.deepBlue) : colors.lightGray,
    boxShadow: isFocused ? `0 0 0 3px ${mode === "po" ? colors.poGreen : colors.deepBlue}33` : "none",
  });

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setOutput(""); 
    setError("");
    setCopied(false); 
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const poData = { buyer: buyerInfo, vendor: vendorInfo, details: poDetails, items: poItems, totals: poTotals };
    
    doc.setFillColor(45, 106, 79); 
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(`PURCHASE ORDER: ${poData.details.poNumber}`, 105, 25, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Buyer: ${poData.buyer.companyName}`, 20, 50);
    doc.text(`Vendor: ${poData.vendor.vendorName}`, 20, 60);
    doc.text(`Total: $${poData.totals.grandTotal}`, 20, 70);
    
    doc.save(`${poData.details.poNumber}.pdf`);
  };

  // --- GENERATE FUNCTION WITH FIXES ---
  async function generate() {
    setOutput(""); setError(""); setLoading(true);
    
    if (mode === "po") {
      // FIX: Corrected the validation to check the actual array state
      const hasFirstItem = poItems?.itemName?.trim() !== "";
  
      if (!buyerInfo.companyName.trim() || !vendorInfo.vendorName.trim() || !poDetails.poNumber.trim() || !hasFirstItem) {
        setError("Please provide at least Company Name, Vendor Name, PO Number, and one Item Description.");
        setLoading(false);
        return;
      }
    }

    const finalBusinessType = businessType === "custom" ? customBusinessType : businessType;

    const payload = mode === "po" 
      ? { mode, buyer: buyerInfo, vendor: vendorInfo, details: poDetails, items: poItems, totals: poTotals }
      : { 
          mode, industry, city, years, 
          businessType: finalBusinessType, 
          tone, description, issueType, apologyContext, 
          rawComments 
        };

    try {
      // FIX: Updated to .org endpoint
      const response = await fetch("https://api.snapcopy.online/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server error");
      const result = data.about || data.reply || data.apology || data.sentiment || data.po || JSON.stringify(data, null, 2);
      setOutput(typeof result === "string" ? result : JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateItem = (index, field, value) => {
    const newItems = [...poItems];
    newItems[index][field] = value;
    setPoItems(newItems);
  };

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", width: "100vw", background: "#f0f2f5", padding: "20px", boxSizing: "border-box", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

      <section style={{ maxWidth: 1000, textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={snapcopyLogo} alt="SnapCopy Logo" style={{ width: 180, height: 180, borderRadius: "50%", marginBottom: 20 }} />
        <h1 style={{ 
          fontSize: "48px", fontWeight: "800",
          background: "linear-gradient(to right, #860aa5, #390b64)", 
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent"
        }}>
          The Complete AI Content Toolkit for Growing Businesses
        </h1>
        <p style={{ color: "#4a5568", fontSize: "18px", marginTop: "10px", maxWidth: "700px", lineHeight: "1.6" }}>
          From professional "About Us" bios to social media management and sentiment analysis. SnapCopy is your all-in-one suite for high-impact content.
        </p>
        <button onClick={scrollToForm} style={{ padding: "16px 32px", background: colors.deepBlue, color: "white", border: "none", borderRadius: "50px", fontWeight: "bold", fontSize: "18px", cursor: "pointer", marginTop: "30px", boxShadow: "0 10px 20px rgba(134, 10, 165, 0.2)" }}>
          Explore Tools
        </button>
      </section>

      <section style={{ width: "100%", maxWidth: 1000, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", padding: "40px 20px", marginBottom: "40px" }}>
        <div>
          <h2 style={{ color: colors.purple, fontSize: "24px" }}>The SnapCopy Toolkit</h2>
          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>We provide a growing ecosystem of AI tools designed for service businesses. Whether you're building a brand bio or analyzing customer feedback, we turn complex tasks into "Snaps."</p>
        </div>
        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: `1px solid ${colors.lightGray}` }}>
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

      <div ref={formRef} style={{ width: "100%", maxWidth: 900 }}>
        <Link to="/interest" style={{ textDecoration: "none", marginBottom: "20px", display: "block" }}>
           <button style={{ width: "100%", padding: "12px", background: "white", color: colors.deepBlue, border: `2px solid ${colors.deepBlue}`, borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
             Interested in SnapCopy or SnapMatrix? Join the waitlist today.
           </button>
        </Link>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "25px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => handleModeSwitch("about")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "about" ? colors.deepBlue : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>About Us</button>
            <button onClick={() => handleModeSwitch("responder")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "responder" ? colors.purple : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Responder</button>
            <button onClick={() => handleModeSwitch("apology")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "apology" ? colors.orange : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Apology</button>
            <button onClick={() => handleModeSwitch("sentiment")} style={{ flex: 1, minWidth: "120px", padding: "12px", background: mode === "sentiment" ? colors.darkSlate : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Sentiment</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={() => handleModeSwitch("po")} style={{ flex: 1, maxWidth: "150px", padding: "12px", background: mode === "po" ? colors.poGreen : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>PO Generator</button>
          </div>
        </nav>

        <div style={{ background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <header style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 key={mode} style={{ 
              fontSize: "36px", margin: 0, fontWeight: "800", display: "inline-block",
              background: mode === "po" ? "linear-gradient(to right, #2d6a4f, #38a169)" : "linear-gradient(to right, #860aa5, #390b64)", 
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" 
            }}>
              {mode === "about" ? "About Us Snap" : mode === "responder" ? "Responder Snap" : mode === "apology" ? "Apology Snap" : mode === "sentiment" ? "Sentiment Snap" : "Purchase Order Snap"}
            </h2>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: mode === "po" ? colors.poGreen : colors.deepBlue, textTransform: "uppercase", letterSpacing: "2px", marginTop: "5px" }}>
              {mode === "sentiment" ? "AI Feedback Analysis" : mode === "po" ? "PDF Generation" : "AI Powered Content"}
            </p>
          </header>

          <div style={{ ...instructionStyle, borderLeftColor: mode === "po" ? colors.poGreen : colors.deepBlue }}>
            <strong>Instructions:</strong> {
              mode === "about" ? "Tell us your industry, location, and experience level. We will generate a professional, SEO-optimized 'About Us' story that builds trust with your local customers." :
              mode === "responder" ? "Choose your business type and a brand voice. We'll craft engaging social media captions, replies, or calls-to-action that resonate with your target audience." :
              mode === "apology" ? "Select the specific issue and provide a brief summary of what happened. Our AI will draft a sincere, de-escalating response to help maintain your professional reputation." :
              mode === "sentiment" ? "Paste raw customer reviews or comments below. We'll analyze the emotional tone and provide a summary of whether the feedback is positive, negative, or neutral." :
              "Provide the SKU, vendor, and pricing details. We'll format this into a professional Purchase Order data structure ready to be exported as a high-quality PDF document."
            }
          </div>

          {error && <p style={{ color: colors.errorRed, background: "#fff5f5", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "15px", border: `1px solid ${colors.errorRed}` }}>{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {mode === "about" && (
              <>
                <InputField label="Industry" value={industry} onChange={setIndustry} placeholder="HVAC, Roofing..." colors={colors} getInputStyle={getInputStyle} />
                <InputField label="City" value={city} onChange={setCity} placeholder="Richmond, VA" colors={colors} getInputStyle={getInputStyle} />
                <InputField label="Years of Experience" value={years} onChange={setYears} placeholder="10" type="number" colors={colors} getInputStyle={getInputStyle} />
              </>
            )}
            {mode === "responder" && (
              <>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Business Type</label>
                <select value={businessType} onChange={(e) => { setBusinessType(e.target.value); if (e.target.value !== "custom") setCustomBusinessType(""); }} style={inputStyle}>
                  <option value="">Select type...</option>
                  <option value="hvac">HVAC Contractor</option>
                  <option value="roofing">Roofing Specialist</option>
                  <option value="plumbing">Plumbing Services</option>
                  <option value="landscaping">Landscaper / Lawn Care</option>
                  <option value="electrical">Electrician</option>
                  <option value="realtor">Realtor / Real Estate Agency</option>
                  <option value="developer">Software Developer / Agency</option>
                  <option value="cleaning">Cleaning Services</option>
                  <option value="painting">Professional Painter</option>
                  <option value="general_contractor">General Contractor</option>
                  <option value="restoration">Restoration Services</option>
                  <option value="automotive">Auto Repair Shop</option>
                  <option value="custom">-- Other / Custom --</option>
                </select>
                {businessType === "custom" && (
                  <InputField label="Enter Business Type" value={customBusinessType} onChange={setCustomBusinessType} placeholder="e.g. Pest Control, Solar Sales..." colors={colors} getInputStyle={getInputStyle} />
                )}
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} style={inputStyle}>
                  <option value="">Select tone...</option>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly / Relatable</option>
                  <option value="urgent">Urgent / Sales-focused</option>
                  <option value="humorous">Humorous / Witty</option>
                </select>
                <InputField label="Short Description (Optional)" value={description} onChange={setDescription} placeholder="What is this post about?" colors={colors} getInputStyle={getInputStyle} />
              </>
            )}
            {mode === "apology" && (
              <>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Issue Type</label>
                <select value={issueType} onChange={(e) => setIssueType(e.target.value)} style={inputStyle}>
                  <option value="">What went wrong?</option>
                  <option value="delay">Service or Shipping Delay</option>
                  <option value="mistake">Technical Error or Mistake</option>
                  <option value="quality">Product or Work Quality Issue</option>
                  <option value="communication">Poor Communication / No-Show</option>
                  <option value="billing">Billing or Overcharge Dispute</option>
                  <option value="staff">Unprofessional Staff Interaction</option>
                  <option value="out_of_stock">Item Out of Stock / Unavailable</option>
                  <option value="scheduling">Scheduling Conflict / Cancellation</option>
                </select>
                <textarea value={apologyContext} onChange={(e) => setApologyContext(e.target.value)} placeholder="Provide context (e.g. 'We missed the Friday appointment because of a truck breakdown')..." style={{ ...inputStyle, height: "100px", resize: "none" }} />
              </>
            )}
            {mode === "sentiment" && (
              <textarea value={rawComments} onChange={(e) => setRawComments(e.target.value)} placeholder="Paste comments here..." style={{ ...inputStyle, height: "150px", resize: "none" }} />
            )}
            
            {mode === "po" && (
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
                </div>

                <div style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "12px", padding: "20px" }}>
                  <h4 style={{ color: colors.poGreen, marginBottom: "15px" }}>Order Items</h4>
                  {poItems.map((item, index) => (
                    <div key={index} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 40px", gap: "10px", marginBottom: "15px", alignItems: "end", paddingBottom: "15px", borderBottom: `1px solid ${colors.lightGray}55` }}>
                      <InputField label="Item Description" value={item.itemName} onChange={(v) => updateItem(index, "itemName", v)} placeholder="Part/Service Name" colors={colors} getInputStyle={getInputStyle} />
                      <InputField label="Qty" type="number" value={item.quantity} onChange={(v) => updateItem(index, "quantity", v)} colors={colors} getInputStyle={getInputStyle} />
                      <InputField label="Price ($)" type="number" value={item.unitPrice} onChange={(v) => updateItem(index, "unitPrice", v)} colors={colors} getInputStyle={getInputStyle} />
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
                        <label style={{ fontSize: "10px", fontWeight: "bold" }}>Tax?</label>
                        <input type="checkbox" checked={item.taxable} onChange={(e) => updateItem(index, "taxable", e.target.checked)} />
                      </div>
                      <button onClick={() => setPoItems(poItems.filter((_, i) => i !== index))} style={{ height: "40px", background: colors.errorRed, color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                  <button onClick={() => setPoItems([...poItems, { itemName: "", partNumber: "", quantity: 1, unitPrice: 0, unitOfMeasure: "pcs", taxable: false, discount: 0, lineNotes: "" }])} style={{ background: colors.poGreen, color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>+ Add Line Item</button>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ width: "300px", padding: "20px", background: "#2d3748", color: "white", borderRadius: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}><span style={{ opacity: 0.8 }}>Subtotal:</span><span>${poTotals.subtotal}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}><span style={{ opacity: 0.8 }}>Tax (8%):</span><span>${poTotals.tax}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #4a5568" }}>
                      <span style={{ fontWeight: "bold" }}>Grand Total:</span><span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#48bb78" }}>${poTotals.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button onClick={generate} disabled={loading} style={{ 
            width: "100%", padding: "15px", marginTop: "20px", border: "none", borderRadius: "10px", 
            fontSize: "16px", fontWeight: "600", color: "white", cursor: loading ? "not-allowed" : "pointer",
            background: mode === "po" ? colors.poGreen : `linear-gradient(135deg, ${colors.deepBlue}, ${colors.purple})`
          }}>
            {loading ? "Processing..." : mode === "po" ? "Generate PO JSON & PDF" : "Run Snap"}
          </button>

          {output && (
            <div style={{ marginTop: "30px", borderTop: `1px solid ${colors.lightGray}`, paddingTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "14px", color: mode === "po" ? colors.poGreen : colors.deepBlue }}>{mode === "po" ? "PO Payload Result:" : "Generated Content:"}</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  {mode === "po" && <button onClick={downloadPDF} style={{ padding: "6px 12px", background: colors.poGreen, color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Download PDF</button>}
                  <button onClick={copyToClipboard} style={{ padding: "6px 12px", background: copied ? colors.successGreen : colors.deepBlue, color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>{copied ? "Copied!" : "Copy Text"}</button>
                </div>
              </div>
              <textarea value={output} readOnly style={{ width: "100%", height: "250px", padding: "15px", borderRadius: "12px", background: "#f8fafc", border: `1px solid ${colors.lightGray}`, resize: "none", fontSize: "14px", lineHeight: "1.6", fontFamily: mode === "po" ? "monospace" : "inherit" }} />
            </div>
          )}
        </div>
      </div>

      <footer style={{ marginTop: "auto", width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px 0", borderTop: `1px solid ${colors.lightGray}88` }}>
        <img src={airStadtLogo} alt="AirStadt Logo" style={{ height: "30px", width: "auto" }} />
        <p style={{ fontSize: "13px", color: colors.footerText }}>&copy; {new Date().getFullYear()} AirStadt. All rights reserved.</p>
      </footer>
    </main>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", colors, getInputStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#718096", textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={getInputStyle(focused)} />
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