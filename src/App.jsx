import { useSearchParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react"; 
import { jsPDF } from "jspdf"; 
import snapcopyLogo from "./assets/snapcopyLogo.png";
import airStadtLogo from "./assets/AirStadtLogo.png";
import InterestForm from "./pages/InterestForm"; 

// --- IMPORT NEW SNAPS HERE ---
import JobEstimator from "./snaps/JobEstimator";
import AboutUs from "./snaps/AboutUs";
import Responder from "./snaps/Responder";
import Apology from "./snaps/Apology";
import Sentiment from "./snaps/Sentiment";
import PoGenerator from "./snaps/PoGenerator";
import Contracts from "./snaps/Contracts";
import PoliciesCompliance from "./snaps/Policies";

function HomePage() {
  
  // --- STATE MANAGEMENT ---
  const [mode, setMode] = useState("about");
  
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


  const [contractType, setContractType] = useState("");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [scope, setScope] = useState("");
  const [terms, setTerms] = useState("");

  const [policyType, setPolicyType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [details, setDetails] = useState("");

  const [specialClauses, setSpecialClauses] = useState("");
  const [buyerInfo, setBuyerInfo] = useState({
    companyName: "", companyAddress: "", contactName: "", contactEmail: "", contactPhone: "", billingAddress: "", shippingAddress: ""
  });

  const [vendorInfo, setVendorInfo] = useState({
    vendorName: "", vendorContact: "", vendorEmail: "", vendorPhone: "", vendorAddress: "", vendorPaymentTerms: ""
  });

  const [poDetails, setPoDetails] = useState({
    poNumber: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
    poDate: new Date().toISOString().split("T"), 
    deliveryDate: "", 
    shippingMethod: "Ground", 
    shippingTerms: "", 
    paymentTerms: "Net 30", 
    notes: ""
  });

  const [poItems, setPoItems] = useState([
    { itemName: "", partNumber: "", quantity: 1, unitPrice: 0, unitOfMeasure: "pcs", taxable: false, discount: 0, lineNotes: "", whereUsed: "" }
  ]);

  const [poTotals, setPoTotals] = useState({ 
    subtotal: 0, 
    taxRate: 8, 
    taxAmount: 0, 
    discountRate: 0, 
    discountAmount: 0, 
    shippingCost: 0, 
    otherCost: 0, 
    grandTotal: 0 
  });

  const [output, setOutput] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const [copied, setCopied] = useState(false); 

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    const allowedModes = ["about", "responder", "apology", "sentiment", "po", "estimator"];
    if (urlMode && allowedModes.includes(urlMode.toLowerCase())) {
      setMode(urlMode.toLowerCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (mode === "po") {
      const itemsSubtotal = poItems.reduce((acc, item) => {
        return acc + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0));
      }, 0);

      const discPercent = parseFloat(poTotals.discountRate) || 0;
      const calculatedDiscount = itemsSubtotal * (discPercent / 100);
      const finalDiscount = parseFloat(poTotals.discountAmount) || calculatedDiscount;

      const subtotalAfterDiscount = itemsSubtotal - finalDiscount;

      const taxPercent = parseFloat(poTotals.taxRate) || 0;
      const calculatedTax = subtotalAfterDiscount * (taxPercent / 100);
      const finalTax = parseFloat(poTotals.taxAmount) || calculatedTax;

      const shipping = parseFloat(poTotals.shippingCost) || 0;
      const other = parseFloat(poTotals.otherCost) || 0;
      
      setPoTotals(prev => ({
        ...prev,
        subtotal: itemsSubtotal.toFixed(2),
        discountAmount: finalDiscount.toFixed(2),
        taxAmount: finalTax.toFixed(2),
        grandTotal: (subtotalAfterDiscount + finalTax + shipping + other).toFixed(2)
      }));
    }
  }, [poItems, poTotals.shippingCost, poTotals.taxRate, poTotals.taxAmount, poTotals.discountRate, poTotals.discountAmount, poTotals.otherCost, mode]);

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
    poGreen: "#2d6a4f",
    lockedGray: "#cbd5e0"
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
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("PURCHASE ORDER", 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`PO NUMBER:`, 140, 20);
    doc.setTextColor(0, 0, 0);
    doc.text(poData.details.poNumber, 170, 20);
    
    doc.setTextColor(100, 100, 100);
    doc.text(`DATE:`, 140, 26);
    doc.setTextColor(0, 0, 0);
    doc.text(poData.details.poDate, 170, 26);

    doc.setTextColor(100, 100, 100);
    doc.text(`DELIVERY:`, 140, 32);
    doc.setTextColor(0, 0, 0);
    doc.text(poData.details.deliveryDate || "ASAP", 170, 32);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);

    let addressY = 55;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BUYER", 20, addressY);
    doc.text("VENDOR", 110, addressY);
    
    doc.setFont("helvetica", "normal");
    addressY += 6;
    doc.text([
      poData.buyer.companyName || "N/A",
      poData.buyer.companyAddress || "N/A",
      `Attn: ${poData.buyer.contactName || "N/A"}`,
      poData.buyer.contactEmail || ""
    ], 20, addressY);

    doc.text([
      poData.vendor.vendorName || "N/A",
      poData.vendor.vendorAddress || "N/A",
      `Payment Terms: ${poData.vendor.vendorPaymentTerms || poData.details.paymentTerms}`
    ], 110, addressY);

    let logisticsY = 95;
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(250, 250, 250);
    doc.rect(20, logisticsY, 170, 18, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("SHIPPING METHOD", 25, logisticsY + 7);
    doc.text("SHIPPING TERMS", 80, logisticsY + 7);
    doc.text("PAYMENT TERMS", 140, logisticsY + 7);
    
    doc.setFont("helvetica", "normal");
    doc.text(poData.details.shippingMethod || "N/A", 25, logisticsY + 13);
    doc.text(poData.details.shippingTerms || "N/A", 80, logisticsY + 13);
    doc.text(poData.details.paymentTerms || "N/A", 140, logisticsY + 13);

    let tableY = 130;
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(20, tableY, 170, 8, "F");
    doc.text("DESCRIPTION", 25, tableY + 5);
    doc.text("P/N", 100, tableY + 5);
    doc.text("QTY", 130, tableY + 5);
    doc.text("PRICE", 150, tableY + 5);
    doc.text("TOTAL", 175, tableY + 5);

    tableY += 13;
    doc.setFont("helvetica", "normal");
    poData.items.forEach((item) => {
      const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
      doc.text(item.itemName || "-", 25, tableY);
      doc.text(item.partNumber || "-", 100, tableY);
      doc.text(String(item.quantity), 130, tableY);
      doc.text(`$${parseFloat(item.unitPrice).toFixed(2)}`, 150, tableY);
      doc.text(`$${lineTotal.toFixed(2)}`, 175, tableY);
      tableY += 8;
    });

    tableY += 10;
    const totalsX = 140;
    doc.setFontSize(10);
    doc.text(`Subtotal:`, totalsX, tableY);
    doc.text(`$${poData.totals.subtotal}`, 175, tableY);
    
    tableY += 6;
    doc.text(`Discount (${poData.totals.discountRate}%):`, totalsX, tableY);
    doc.text(`-$${poData.totals.discountAmount}`, 175, tableY);
    
    tableY += 6;
    doc.text(`Sales Tax (${poData.totals.taxRate}%):`, totalsX, tableY);
    doc.text(`$${poData.totals.taxAmount}`, 175, tableY);
    
    tableY += 6;
    doc.text(`Shipping:`, totalsX, tableY);
    doc.text(`$${poData.totals.shippingCost}`, 175, tableY);

    tableY += 10;
    doc.setDrawColor(0, 0, 0);
    doc.line(totalsX - 5, tableY - 5, 190, tableY - 5);
    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL:", totalsX, tableY + 2);
    doc.text(`$${poData.totals.grandTotal}`, 175, tableY + 2);

    const footerY = 250;
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("TERMS AND CONDITIONS", 20, footerY);
    doc.setFont("helvetica", "normal");
    const terms = [
      "1. Please send all invoices to the buyer's contact email listed above.",
      "2. Notify us immediately if you are unable to ship as specified.",
      "3. All items are subject to inspection and approval at the time of delivery.",
      "4. This order is subject to the payment terms defined in the logistics section."
    ];
    doc.text(terms, 20, footerY + 5);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.line(130, 275, 190, 275);
    doc.text("AUTHORIZED SIGNATURE", 130, 280);

    doc.save(`${poData.details.poNumber}.pdf`);
  };

  async function generate() {
    setOutput(""); setError(""); setLoading(true);
    
    if (mode === "po") {
      const hasFirstItem = poItems?.itemName?.trim() !== "";
      if (!buyerInfo.companyName.trim() || !vendorInfo.vendorName.trim() || !poDetails.poNumber.trim() || !hasFirstItem) {
        setError("Please provide at least Company Name, Vendor Name, PO Number, and one Item Description.");
        setLoading(false);
        return;
      }
    }

    const finalBusinessType = businessType === "custom" ? customBusinessType : businessType;

    const payload =
  mode === "po"
    ? { mode, buyer: buyerInfo, vendor: vendorInfo, details: poDetails, items: poItems, totals: poTotals }
    : mode === "contracts"
    ? {
        mode,
        contractType,
        partyA,
        partyB,
        scope,
        terms,
        specialClauses
      }
    : {
        mode,
        industry,
        city,
        years,
        businessType,
        customBusinessType,
        tone,
        description,
        issueType,
        apologyContext,
        rawComments
      };


    try {
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

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", width: "100vw", background: "#f0f2f5", padding: "20px", boxSizing: "border-box", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

      <section style={{ maxWidth: 1000, textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={snapcopyLogo} alt="SnapCopy Logo" style={{ width: 180, height: 180, borderRadius: "50%", marginBottom: 20 }} />
        <h1 style={{ 
          fontSize: "48px", fontWeight: "800",
          background: "linear-gradient(to right, #860aa5, #390b64)", 
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", lineHeight: "1.4",
        }}>
          The Complete AI Content Toolkit for Growing Businesses
        </h1>
        <p style={{ color: "#4a5568", fontSize: "18px", marginTop: "14px", maxWidth: "700px", lineHeight: "1.6" }}>
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
              <li><b>Contracts & Agreements:</b> Service agreements, NDAs, subcontractor contracts, and more.</li>
              <li><b>Policies & Compliance:</b> Refund, Warranty, Privacy, and Terms of Service policies.</li>
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
            <button onClick={() => handleModeSwitch("contracts")} style={{flex: 1, minWidth: "120px", padding: "12px", background: mode === "contracts" ? colors.deepBlue : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Contracts</button>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={() => handleModeSwitch("po")} style={{ flex: 1, maxWidth: "150px", padding: "12px", background: mode === "po" ? colors.poGreen : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>PO Generator</button>
            <button onClick={() => handleModeSwitch("estimator")} style={{ flex: 1, maxWidth: "150px", padding: "12px", background: mode === "estimator" ? colors.deepBlue : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Job Estimator</button>
            <button onClick={() => handleModeSwitch("policies")}style={{flex: 1, maxWidth: "150px", padding: "12px", background: mode === "policies" ? colors.deepBlue : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer"}} >Policies</button>
</div>
          
            




        </nav>

        <div style={{ background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
          <header style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 key={mode} style={{ 
              fontSize: "36px", margin: 0, fontWeight: "800", display: "inline-block",
              background: mode === "po" ? "linear-gradient(to right, #2d6a4f, #38a169)" : "linear-gradient(to right, #860aa5, #390b64)", 
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" 
            }}>
      {mode === "about" ? "About Us Snap" : mode === "responder" ? "Responder Snap" : mode === "apology" ? "Apology Snap" : mode === "sentiment" ? "Sentiment Snap" : mode === "po" ? "Purchase Order Snap" : "Job Estimator Snap"}
            </h2>
          </header>

          <div style={{ ...instructionStyle, borderLeftColor: mode === "po" ? colors.poGreen : colors.deepBlue }}>
            <strong>Instructions:</strong> {
              mode === "about" ? "Tell us your industry, location, and experience level. We will generate a professional, SEO-optimized 'About Us' story that builds trust with your local customers." :
              mode === "responder" ? "Choose your business type and a brand voice. We'll craft engaging social media captions, replies, or calls-to-action that resonate with your target audience." :
              mode === "apology" ? "Select the specific issue and provide a brief summary of what happened. Our AI will draft a sincere, de-escalating response to help maintain your professional reputation." :
              mode === "sentiment" ? "Paste raw customer reviews or comments below. We'll analyze the emotional tone and provide a summary of whether the feedback is positive, negative, or neutral." :
              mode === "po" ? "Provide the SKU, vendor, and pricing details. We'll format this into a professional Purchase Order data structure ready to be exported as a high-quality PDF document." :
              "Fill out the labor, materials, and fees. Our AI will help classify tasks and suggest a professional job summary for your customer."
            }
          </div>

          {error && <p style={{ color: colors.errorRed, background: "#fff5f5", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "15px", border: `1px solid ${colors.errorRed}` }}>{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            {mode === "about" && (
              <AboutUs 
                colors={colors} 
                inputStyle={inputStyle} 
                industry={industry} setIndustry={setIndustry}
                city={city} setCity={setCity}
                years={years} setYears={setYears}
                businessType={businessType} setBusinessType={setBusinessType}
                customBusinessType={customBusinessType} setCustomBusinessType={setCustomBusinessType}
                description={description} setDescription={setDescription}
              />
            )}
            
            {mode === "responder" && (
              <Responder 
                colors={colors} 
                inputStyle={inputStyle} 
                businessType={businessType} 
                setBusinessType={setBusinessType}
                customBusinessType={customBusinessType} 
                setCustomBusinessType={setCustomBusinessType}
                tone={tone} 
                setTone={setTone} 
                description={description} 
                setDescription={setDescription} 
          />
            )}
            
            {mode === "apology" && (
              <Apology 
                colors={colors}
                inputStyle={inputStyle}
                issueType={issueType}
                setIssueType={setIssueType}
                apologyContext={apologyContext}
                setApologyContext={setApologyContext}
              />
            )}

            {mode === "sentiment" && (
              <Sentiment 
                inputStyle={inputStyle}
                rawComments={rawComments}
                setRawComments={setRawComments}
              />
            )}

            {mode === "contracts" && (
            <Contracts
              colors={colors}
              inputStyle={inputStyle}
              contractType={contractType}
              setContractType={setContractType}
              partyA={partyA}
              setPartyA={setPartyA}
              partyB={partyB}
              setPartyB={setPartyB}
              scope={scope}
              setScope={setScope}
              terms={terms}
              setTerms={setTerms}
              specialClauses={specialClauses}
              setSpecialClauses={setSpecialClauses}
            />
  )}

            
            {mode === "po" && (
              <PoGenerator
                colors={colors}
                inputStyle={inputStyle}
                getInputStyle={getInputStyle}
                buyerInfo={buyerInfo} setBuyerInfo={setBuyerInfo}
                vendorInfo={vendorInfo} setVendorInfo={setVendorInfo}
                poDetails={poDetails} setPoDetails={setPoDetails}
                poItems={poItems} setPoItems={setPoItems}
                poTotals={poTotals} setPoTotals={setPoTotals}
              />
            )}
            

            {mode === "estimator" && (
               <JobEstimator colors={colors} inputStyle={inputStyle} getInputStyle={getInputStyle} />
            )}
          </div>

          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={generate} disabled={loading} style={{ flex: 2, padding: "15px", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", color: "white", cursor: loading ? "not-allowed" : "pointer", background: mode === "po" ? colors.poGreen : `linear-gradient(135deg, ${colors.deepBlue}, ${colors.purple})` }}>
                {loading ? "Processing..." : mode === "po" ? "Generate PO JSON & PDF" : mode === "estimator" ? "Generate AI Job Summary" : "Run Snap"}
              </button>
              
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <button disabled style={{ width: "100%", height: "100%", padding: "15px", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", color: "white", background: colors.lockedGray, cursor: "not-allowed" }}>
                  Save to DB
                </button>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#718096", textAlign: "right", margin: "0", fontStyle: "italic" }}>
              * Save to DB functionality is exclusive to subscription users.
            </p>
          </div>

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