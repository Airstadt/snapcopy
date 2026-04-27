import { useSearchParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";

import snapcopyLogo from "./assets/snapcopyLogo.png";
import airStadtLogo from "./assets/AirStadtLogo.png";

import InterestForm from "./pages/InterestForm";

// --- IMPORT SNAPS ---
import JobEstimator from "./snaps/JobEstimator";
import AboutUs from "./snaps/AboutUs";
import Responder from "./snaps/Responder";
import Apology from "./snaps/Apology";
import Sentiment from "./snaps/Sentiment";
import PoGenerator from "./snaps/PoGenerator";
import Contracts from "./snaps/Contracts";
import PoliciesCompliance from "./snaps/Policies.jsx";

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
  const [specialClauses, setSpecialClauses] = useState("");

  // POLICIES SNAP STATE
  const [policyType, setPolicyType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [details, setDetails] = useState("");

  const [buyerInfo, setBuyerInfo] = useState({
    companyName: "",
    companyAddress: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    billingAddress: "",
    shippingAddress: ""
  });

  const [vendorInfo, setVendorInfo] = useState({
    vendorName: "",
    vendorContact: "",
    vendorEmail: "",
    vendorPhone: "",
    vendorAddress: "",
    vendorPaymentTerms: ""
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
    {
      itemName: "",
      partNumber: "",
      quantity: 1,
      unitPrice: 0,
      unitOfMeasure: "pcs",
      taxable: false,
      discount: 0,
      lineNotes: "",
      whereUsed: ""
    }
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
    const allowedModes = [
      "about",
      "responder",
      "apology",
      "sentiment",
      "po",
      "estimator",
      "contracts",
      "policies"
    ];

    if (urlMode && allowedModes.includes(urlMode.toLowerCase())) {
      setMode(urlMode.toLowerCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (mode === "po") {
      const itemsSubtotal = poItems.reduce((acc, item) => {
        return (
          acc +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)
        );
      }, 0);

      const discPercent = parseFloat(poTotals.discountRate) || 0;
      const calculatedDiscount = itemsSubtotal * (discPercent / 100);
      const finalDiscount =
        parseFloat(poTotals.discountAmount) || calculatedDiscount;

      const subtotalAfterDiscount = itemsSubtotal - finalDiscount;

      const taxPercent = parseFloat(poTotals.taxRate) || 0;
      const calculatedTax = subtotalAfterDiscount * (taxPercent / 100);
      const finalTax = parseFloat(poTotals.taxAmount) || calculatedTax;

      const shipping = parseFloat(poTotals.shippingCost) || 0;
      const other = parseFloat(poTotals.otherCost) || 0;

      setPoTotals((prev) => ({
        ...prev,
        subtotal: itemsSubtotal.toFixed(2),
        discountAmount: finalDiscount.toFixed(2),
        taxAmount: finalTax.toFixed(2),
        grandTotal: (
          subtotalAfterDiscount +
          finalTax +
          shipping +
          other
        ).toFixed(2)
      }));
    }
  }, [
    poItems,
    poTotals.shippingCost,
    poTotals.taxRate,
    poTotals.taxAmount,
    poTotals.discountRate,
    poTotals.discountAmount,
    poTotals.otherCost,
    mode
  ]);

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
    lockedGray: "#cbd5e0",
    policyLabel: "#4a5568"
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
    boxSizing: "border-box"
  };

  const getInputStyle = (isFocused) => ({
    ...inputStyle,
    borderColor: isFocused
      ? mode === "po"
        ? colors.poGreen
        : colors.deepBlue
      : colors.lightGray,
    boxShadow: isFocused
      ? `0 0 0 3px ${
          mode === "po" ? colors.poGreen : colors.deepBlue
        }33`
      : "none"
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

  // ---------------------------------------------------------
  // GENERATE FUNCTION
  // ---------------------------------------------------------
  async function generate() {
    setOutput("");
    setError("");
    setLoading(true);

    const payload =
      mode === "po"
        ? {
            mode,
            buyer: buyerInfo,
            vendor: vendorInfo,
            details: poDetails,
            items: poItems,
            totals: poTotals
          }
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
        : mode === "policies"
        ? {
            mode,
            policyType,
            businessName,
            details
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

      const result =
        data.about ||
        data.reply ||
        data.apology ||
        data.sentiment ||
        data.po ||
        data.contract ||
        data.policy ||
        JSON.stringify(data, null, 2);

      setOutput(
        typeof result === "string" ? result : JSON.stringify(result, null, 2)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Make generate() callable from Snaps
  window.generateSnap = generate;

  // ---------------------------------------------------------
  // RETURN UI
  // ---------------------------------------------------------
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "#f0f2f5",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          maxWidth: 1000,
          textAlign: "center",
          padding: "60px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <img
          src={snapcopyLogo}
          alt="SnapCopy Logo"
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            marginBottom: 20
          }}
        />

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            background: "linear-gradient(to right, #860aa5, #390b64)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            lineHeight: "1.4"
          }}
        >
          The Complete AI Content Toolkit for Growing Businesses
        </h1>

        <p
          style={{
            color: "#4a5568",
            fontSize: "18px",
            marginTop: "14px",
            maxWidth: "700px",
            lineHeight: "1.6"
          }}
        >
          From professional "About Us" bios to social media management and
          sentiment analysis. SnapCopy is your all-in-one suite for high-impact
          content.
        </p>

        <button
          onClick={scrollToForm}
          style={{
            padding: "16px 32px",
            background: colors.deepBlue,
            color: "white",
            border: "none",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "18px",
            cursor: "pointer",
            marginTop: "30px",
            boxShadow: "0 10px 20px rgba(134, 10, 165, 0.2)"
          }}
        >
          Explore Tools
        </button>
      </section>

      {/* TOOLKIT SECTION */}
      <section
        style={{
          width: "100%",
          maxWidth: 1000,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "40px",
          padding: "40px 20px",
          marginBottom: "40px"
        }}
      >
        <div>
          <h2 style={{ color: colors.purple, fontSize: "24px" }}>
            The SnapCopy Toolkit
          </h2>
          <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
            We provide a growing ecosystem of AI tools designed for service
            businesses. Whether you're building a brand bio or analyzing
            customer feedback, we turn complex tasks into "Snaps."
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            border: `1px solid ${colors.lightGray}`
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              color: colors.deepBlue,
              textTransform: "uppercase",
              marginBottom: "15px"
            }}
          >
            Current Capabilities
          </h3>

          <ul
            style={{
              color: "#4a5568",
              fontSize: "15px",
              paddingLeft: "20px",
              lineHeight: "2"
            }}
          >
            <li>
              <b>About Us:</b> SEO-ready business bios.
            </li>
            <li>
              <b>Responder:</b> Engaging social media captions.
            </li>
            <li>
              <b>Apology:</b> Polished customer resolution writing.
            </li>
            <li>
              <b>Sentiment:</b> Deep emotional feedback analysis.
            </li>
            <li>
              <b>Contracts & Agreements:</b> Service agreements, NDAs,
              subcontractor contracts, and more.
            </li>
            <li>
              <b>Policies & Compliance:</b> Refund, Warranty, Privacy, and Terms
              of Service policies.
            </li>
            <li>
              <b style={{ color: colors.poGreen }}>PO Generator:</b> Instant PDF
              Purchase Orders.
            </li>
          </ul>
        </div>
      </section>

      {/* FORM SECTION */}
      <div ref={formRef} style={{ width: "100%", maxWidth: 900 }}>
        <Link
          to="/interest"
          style={{
            textDecoration: "none",
            marginBottom: "20px",
            display: "block"
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "12px",
              background: "white",
              color: colors.deepBlue,
              border: `2px solid ${colors.deepBlue}`,
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Interested in SnapCopy or SnapMatrix? Join the waitlist today.
          </button>
        </Link>

        {/* NAV BUTTONS */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "25px"
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => handleModeSwitch("about")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background:
                  mode === "about" ? colors.deepBlue : "#bda4c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              About Us
            </button>

            <button
              onClick={() => handleModeSwitch("responder")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background:
                  mode === "responder" ? colors.purple : "#bda4c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Responder
            </button>

            <button
              onClick={() => handleModeSwitch("apology")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background:
                  mode === "apology" ? colors.orange : "#bda4c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Apology
            </button>

            <button
              onClick={() => handleModeSwitch("sentiment")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background:
                  mode === "sentiment" ? colors.darkSlate : "#bda4c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Sentiment
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => handleModeSwitch("po")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background:
                  mode === "po" ? colors.poGreen : "#bda4c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              PO Generator
            </button>

            <button
              onClick={() => handleModeSwitch("estimator")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background:
                  mode === "estimator" ? colors.deepBlue : "#bda4c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Job Estimator
            </button>

            <button
              onClick={() => handleModeSwitch("contracts")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background:
                  mode === "contracts" ? colors.purple : "#bda4c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Contracts
            </button>

            <button
              onClick={() => handleModeSwitch("policies")}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "12px",
                background:
                  mode === "policies" ? colors.orange : "#bda4c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Policies
            </button>
          </div>
        </nav>

        {/* TOOL CONTENT */}
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            border: `1px solid ${colors.lightGray}`,
            marginBottom: "40px"
          }}
        >
          <header style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 key={mode} style={{ 
              fontSize: "36px", margin: 0, fontWeight: "800", display: "inline-block",
              background: mode === "po" ? "linear-gradient(to right, #2d6a4f, #38a169)" : "linear-gradient(to right, #860aa5, #390b64)", 
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" 
            }}>
              {mode === "about" ? "About Us Snap" : 
               mode === "responder" ? "Responder Snap" : 
               mode === "apology" ? "Apology Snap" : 
               mode === "sentiment" ? "Sentiment Snap" : 
               mode === "po" ? "Purchase Order Snap" : 
               mode === "contracts" ? "Contracts Snap" :
               mode === "policies" ? "Policies Snap" :
               "Job Estimator Snap"}
            </h2>
          </header>

          <div style={{ ...instructionStyle, borderLeftColor: mode === "po" ? colors.poGreen : colors.deepBlue }}>
            <strong>Instructions:</strong> {
              mode === "about" ? "Tell us your industry, location, and experience level. We will generate a professional, SEO-optimized 'About Us' story that builds trust with your local customers." :
              mode === "responder" ? "Choose your business type and a brand voice. We'll craft engaging social media captions, replies, or calls-to-action that resonate with your target audience." :
              mode === "apology" ? "Select the specific issue and provide a brief summary of what happened. Our AI will draft a sincere, de-escalating response to help maintain your professional reputation." :
              mode === "sentiment" ? "Paste raw customer reviews or comments below. We'll analyze the emotional tone and provide a summary of whether the feedback is positive, negative, or neutral." :
              mode === "po" ? "Provide the SKU, vendor, and pricing details. We'll format this into a professional Purchase Order data structure ready to be exported as a high-quality PDF document." :
              mode === "contracts" ? "Enter the details for both parties and the specific scope of work. We will generate a structured legal agreement tailored to your service or partnership needs." :
              mode === "policies" ? "Specify the policy type and your business rules. We'll draft a comprehensive compliance document, such as a Privacy Policy or Terms of Service, for your operations." :
              "Fill out the labor, materials, and fees. Our AI will help classify tasks and suggest a professional job summary for your customer."
            }
          </div>

          {/* RENDER SNAPS - DEFENSIVE RENDER WRAPPERS APPLIED */}
          {mode === "about" && (
            <AboutUs
              industry={industry}
              setIndustry={setIndustry}
              city={city}
              setCity={setCity}
              years={years}
              setYears={setYears}
              businessType={businessType}
              setBusinessType={setBusinessType}
              customBusinessType={customBusinessType}
              setCustomBusinessType={setCustomBusinessType}
              tone={tone}
              setTone={setTone}
              inputStyle={inputStyle}
            />
          )}

          {mode === "responder" && (
            <Responder
              businessType={businessType}
              setBusinessType={setBusinessType}
              customBusinessType={customBusinessType}
              setCustomBusinessType={setCustomBusinessType}
              tone={tone}
              setTone={setTone}
              description={description}
              setDescription={setDescription}
              inputStyle={inputStyle}
            />
          )}

          {mode === "apology" && (
            <Apology
              issueType={issueType}
              setIssueType={setIssueType}
              apologyContext={apologyContext}
              setApologyContext={setApologyContext}
              inputStyle={inputStyle}
            />
          )}

          {mode === "sentiment" && (
            <Sentiment
              rawComments={rawComments}
              setRawComments={setRawComments}
              inputStyle={inputStyle}
            />
          )}

          {mode === "po" && poItems && poDetails && (
            <PoGenerator
              buyerInfo={buyerInfo}
              setBuyerInfo={setBuyerInfo}
              vendorInfo={vendorInfo}
              setVendorInfo={setVendorInfo}
              poDetails={poDetails}
              setPoDetails={setPoDetails}
              poItems={poItems}
              setPoItems={setPoItems}
              poTotals={poTotals}
              setPoTotals={setPoTotals}
              colors={colors}
              inputStyle={inputStyle}
              getInputStyle={getInputStyle}
            />
          )}

          {mode === "estimator" && colors && (
            <JobEstimator inputStyle={inputStyle} colors={colors} />
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

          {mode === "policies" && (
            <div className="snap-container">
              <label style={{ fontSize: "14px", fontWeight: "600", color: colors.policyLabel }}>Policy Type</label>
              <select 
                style={inputStyle} 
                value={policyType} 
                onChange={(e) => setPolicyType(e.target.value)}
              >
                <option value="">Select Policy Type</option>
                <option value="Refund Policy">Refund Policy</option>
                <option value="Warranty Policy">Warranty Policy</option>
                <option value="Privacy Policy">Privacy Policy</option>
                <option value="Terms of Service">Terms of Service</option>
              </select>

              <label style={{ fontSize: "14px", fontWeight: "600", color: colors.policyLabel, marginTop: "10px", display: "block" }}>Business Name</label>
              <input
                style={inputStyle}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business or website name"
              />

              <label style={{ fontSize: "14px", fontWeight: "600", color: colors.policyLabel, marginTop: "10px", display: "block" }}>Key Details</label>
              <textarea
                style={{ ...inputStyle, height: "120px", resize: "none" }}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Add important details, rules, exclusions, or requirements"
              />

              <button 
                onClick={generate}
                style={{
                  width: "100%",
                  padding: "16px",
                  marginTop: "25px",
                  background: colors.orange,
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Generate Policy
              </button>
            </div>
          )}

          {/* SHARED GENERATE BUTTON */}
          {mode !== "policies" && (
            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "25px",
                background: mode === "po" ? colors.poGreen : colors.deepBlue,
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s"
              }}
            >
              {loading ? "Snapping..." : `Generate ${mode === "po" ? "PO Data" : "Snap"}`}
            </button>
          )}

          {/* OUTPUT AREA */}
          {error && (
            <div style={{ color: colors.errorRed, marginTop: "20px", fontWeight: "bold" }}>
              {error}
            </div>
          )}

          {output && (
            <div style={{ marginTop: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: colors.darkSlate }}>Your Snap Result:</h3>
                <button
                  onClick={copyToClipboard}
                  style={{
                    background: "none",
                    border: `1px solid ${colors.lightGray}`,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: colors.deepBlue
                  }}
                >
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              </div>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "10px",
                  border: `1px solid ${colors.lightGray}`,
                  whiteSpace: "pre-wrap",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: colors.textDark,
                  minHeight: "100px"
                }}
              >
                {output}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer style={{ textAlign: "center", padding: "40px 0", borderTop: `1px solid ${colors.lightGray}` }}>
          <img src={airStadtLogo} alt="AirStadt Logo" style={{ height: 40, opacity: 0.8, marginBottom: 15 }} />
          <p style={{ color: colors.footerText, fontSize: "14px" }}>
            &copy; {new Date().getFullYear()} SnapCopy by AirStadt. All rights reserved.
          </p>
        </footer>
      </div>
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