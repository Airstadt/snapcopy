import { useSearchParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";

import snapcopyLogo from "./assets/snapcopyLogo.png";
import airStadtLogo from "./assets/AirStadtLogo.png";

import InterestForm from "./pages/InterestForm";

// --- IMPORT SNAPS ---
import JobEstimator from "./snaps/jobEstimator";
import AboutUs from "./snaps/AboutUs";
import Responder from "./snaps/Responder";
import Apology from "./snaps/Apology";
import Sentiment from "./snaps/Sentiment";
import PoGenerator from "./snaps/PoGenerator";
import Contracts from "./snaps/Contracts";
import PoliciesCompliance from "./snaps/Policies.jsx";
import "jspdf-autotable";

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

// --- JOB ESTIMATOR LOGIC (App.jsx) ---

// 1. STATE
const [header, setHeader] = useState({
  jobTitle: "",
  customerName: "",
  contactInfo: "",
  location: "",
  description: "",
  category: "",
  status: "Estimate",
  dueDate: ""
});

const [tasks, setTasks] = useState([
  { desc: "", type: "Hourly", rate: 0, qty: 1, taxable: false }
]);

// Inside App.jsx - Materials Initial State
const [materials, setMaterials] = useState([
  { desc: "", qty: 1, cost: 0, uom: "pcs", taxable: true } 
]);

const [fees, setFees] = useState([
  { type: "Travel Fee", amount: 0 }
]);

const [financials, setFinancials] = useState({
  deposit: 0,
  discount: 0,
  taxRate: 8,
  terms: "Due on Receipt"
});


// 2. UPDATE HELPERS
const updateTask = (index, field, value) => {
  const updated = [...tasks];
  updated[index][field] = value;
  setTasks(updated);
};

const removeTask = (index) => {
  setTasks(tasks.filter((_, i) => i !== index));
};

const addTask = () => {
  setTasks([
    ...tasks,
    { desc: "", type: "Hourly", rate: 0, qty: 1, taxable: false }
  ]);
};


const updateMaterial = (index, field, value) => {
  const updated = [...materials];
  updated[index][field] = value;
  setMaterials(updated);
};

const removeMaterial = (index) => {
  setMaterials(materials.filter((_, i) => i !== index));
};

const addMaterial = () => {
  setMaterials([
    ...materials,
    { desc: "", qty: 1, cost: 0, uom: "pcs", taxable: true }
  ]);
};


const updateFee = (index, field, value) => {
  const updated = [...fees];
  updated[index][field] = value;
  setFees(updated);
};


// 3. TOTAL CALCULATION
const calculateTotal = () => {
  const labor = tasks.reduce(
    (sum, t) => sum + (parseFloat(t.rate || 0) * parseFloat(t.qty || 0)),
    0
  );

  const mats = materials.reduce(
    (sum, m) => sum + (parseFloat(m.cost || 0) * parseFloat(m.qty || 0)),
    0
  );

  const addOns = fees.reduce(
    (sum, f) => sum + parseFloat(f.amount || 0),
    0
  );

  const subtotal = labor + mats + addOns;
  const afterDiscount = subtotal - parseFloat(financials.discount || 0);
  const tax = afterDiscount * (parseFloat(financials.taxRate || 0) / 100);

  return (afterDiscount + tax).toFixed(2);
};
//--------------------------------------------------------About us--------------------------------//

//--------------------policies pdf download handler (App.jsx)------------------------------//
const handlePoliciesDownload = () => {
  if (!output) return;

  const doc = new jsPDF();
  const margin = 20;
  const maxWidth = 170;
  let yPos = 20;

  // 1. Header
  doc.setFontSize(22);
  doc.setTextColor(colors.orange); // Using the orange theme color for Policies
  doc.text(policyType.toUpperCase() || "BUSINESS POLICY", margin, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Official Document for: ${businessName || "N/A"}`, margin, yPos);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 140, yPos);
  
  yPos += 10;
  doc.setDrawColor(colors.orange);
  doc.line(margin, yPos, 190, yPos);
  yPos += 15;

  // 2. Content
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");

  const lines = doc.splitTextToSize(output, maxWidth);
  lines.forEach((line) => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, margin, yPos);
    yPos += 6; 
  });

  // Save with a clean filename
  const fileName = `${businessName.replace(/\s+/g, '_')}_${policyType.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
//--------------------------------------------about us ------------------------------------------//
const handleAboutDownload = () => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = 20;

  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("COMPANY PROFILE", margin, yPos);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, yPos);
  
  yPos += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, yPos, 190, yPos);
  yPos += 20;

  if (output) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);
    const wrappedText = doc.splitTextToSize(output, 170);
    doc.text(wrappedText, margin, yPos);
  }
  doc.save(`${businessName || "Company"}_Bio.pdf`);
};
//-------------------------------------------End about us ----------------------------------------------//
//-------------------------------------------------Apology-=--------------------------------------------//
// 4. OFFICIAL APOLOGY HANDLER
const handleApologyDownload = () => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = 20;

  // 1. Header
  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("OFFICIAL CORRESPONDENCE", margin, yPos);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, yPos);
  
  yPos += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, yPos, 190, yPos);
  yPos += 20;

  // 2. Business Branding
  if (businessName) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(businessName.toUpperCase(), margin, yPos);
    yPos += 12;
  }

  // 3. Body Content
  if (output) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);

    const maxWidth = 170; 
    const wrappedText = doc.splitTextToSize(output, maxWidth);
    
    wrappedText.forEach(line => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += 7;
    });
  }

  // 4. Closing Placeholder
  yPos += 15;
  if (yPos > 270) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.text("Sincerely,", margin, yPos);
  yPos += 10;
  doc.text(businessName || "Management", margin, yPos);

  doc.save("Official_Apology.pdf");
};
//-----------------------------------------------Responder---------------------------------------------//
// SOCIAL MEDIA RESPONDER HANDLER
const handleResponderDownload = () => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = 20;

  // 1. Header (Deep Blue)
  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("CUSTOMER RESPONSE", margin, yPos);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, yPos);
  
  yPos += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, yPos, 190, yPos);
  yPos += 20;

  // 2. Business Branding (Black)
  if (businessName) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0); // Black
    doc.text(businessName.toUpperCase(), margin, yPos);
    yPos += 12;
  }

  // 3. AI Generated Response (Black)
  if (output) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0); // Black
    doc.text("DRAFTED RESPONSE:", margin, yPos);
    yPos += 10;

    doc.setFont("helvetica", "normal");
    const maxWidth = 170; 
    const wrappedText = doc.splitTextToSize(output, maxWidth);
    
    wrappedText.forEach(line => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += 7;
    });
  }

  doc.save(`${businessName || "Social"}_Response.pdf`);
};
//---------------------------------------end of policies pdf download handler-----------------------------------//
//----------------------------------------sentiment--------------------------------------------------------------//
// 5. SENTIMENT ANALYSIS HANDLER
const handleSentimentDownload = () => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = 20;

  // 1. Header
  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("SENTIMENT ANALYSIS REPORT", margin, yPos);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 145, yPos);
  
  yPos += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, yPos, 190, yPos);
  yPos += 20;

  // 2. Analysis Overview
  if (businessName) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Analysis for: ${businessName.toUpperCase()}`, margin, yPos);
    yPos += 15;
  }

  // 3. Body Content (The AI Analysis)
  if (output) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.deepBlue);
    doc.text("EXECUTIVE SUMMARY:", margin, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);

    const maxWidth = 170; 
    const wrappedText = doc.splitTextToSize(output, maxWidth);
    
    wrappedText.forEach(line => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += 7;
    });
  }

  // 4. Footer Note
  yPos += 15;
  if (yPos > 275) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150);
  doc.text("This report was generated via AI Sentiment Analysis for internal review purposes.", margin, yPos);

  doc.save(`${businessName || "Business"}_Sentiment_Report.pdf`);
};

//--------------------------------------------contract pdf download--------------------------------------------///
// --- Contracts PDF Download Handler ---
const handleContractDownload = () => {
  const doc = new jsPDF();
  const margin = 20;
  const maxWidth = 170;
  let yPos = 20;

  // 1. Header
  doc.setFontSize(20);
  doc.setTextColor(colors.purple);
  doc.text(contractType.toUpperCase() || "LEGAL AGREEMENT", margin, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPos);
  
  yPos += 10;
  doc.setDrawColor(colors.purple);
  doc.line(margin, yPos, 190, yPos);
  yPos += 15;

  // 2. Parties Involved
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("BETWEEN:", margin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`Party A: ${partyA || "N/A"}`, margin, yPos);
  yPos += 6;
  doc.text(`Party B: ${partyB || "N/A"}`, margin, yPos);
  
  yPos += 15;

  // 3. AI Generated Content (The Contract Body)
  if (output) {
    doc.setFont("helvetica", "bold");
    doc.text("AGREEMENT TERMS:", margin, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // Split text to ensure it wraps and doesn't trim horizontally
    const wrappedContract = doc.splitTextToSize(output, maxWidth);
    
    wrappedContract.forEach((line) => {
      // Check for vertical page overflow
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += 6; // Line spacing
    });
  }

  // 4. Signature Blocks (placed at the end of the text)
  yPos += 20;
  if (yPos > 250) { doc.addPage(); yPos = 20; }

  doc.setFont("helvetica", "bold");
  doc.text("Signatures:", margin, yPos);
  yPos += 15;
  doc.text("__________________________", margin, yPos);
  doc.text("__________________________", 110, yPos);
  yPos += 5;
  doc.setFontSize(9);
  doc.text(`For: ${partyA || "Party A"}`, margin, yPos);
  doc.text(`For: ${partyB || "Party B"}`, 110, yPos);

  doc.save(`${contractType.replace(/\s+/g, '_')}_Agreement.pdf`);
};
//------=======================================================end of contract pdf download handler-----------------------------------//
//----==------------------------------------------------------poGenerator pdf download handler (App.jsx)------------------------------//


const handlePoDownload = () => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width - margin * 2;
  const pageHeight = doc.internal.pageSize.height;
  let y = margin;

  const accent = colors?.poGreen || "#2E7D32";
  const textGray = "#333333";
  const lightGray = "#E0E0E0";

  // Page break helper
  const checkPageBreak = (space = 12) => {
    if (y + space > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // ---------------------------
  // HEADER
  // ---------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(textGray);
  doc.text("Purchase Order", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`PO #: ${poDetails?.poNumber || "N/A"}`, margin + pageWidth - 60, y);
  doc.text(`Date: ${poDetails?.poDate || "N/A"}`, margin + pageWidth - 60, y + 6);

  y += 14;
  doc.setDrawColor(lightGray);
  doc.line(margin, y, margin + pageWidth, y);
  y += 10;

  // ---------------------------
  // BILL TO / SHIP TO / SHIP FROM
  // ---------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Bill To", margin, y);
  doc.text("Ship To", margin, y + 20);
  doc.text("Ship From", margin + pageWidth / 2, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // BILL TO
  doc.text(buyerInfo?.companyName || "N/A", margin, y + 6);
  doc.text(buyerInfo?.companyAddress || "", margin, y + 11);

  // SHIP TO (under Bill To)
  doc.text(buyerInfo?.shipToName || buyerInfo?.companyName || "N/A", margin, y + 26);
  doc.text(buyerInfo?.shipToAddress || buyerInfo?.companyAddress || "", margin, y + 31);

  // SHIP FROM (vendor)
  doc.text(vendorInfo?.vendorName || "N/A", margin + pageWidth / 2, y + 6);
  doc.text(vendorInfo?.vendorAddress || "", margin + pageWidth / 2, y + 11);

  y += 45;

  // ---------------------------
  // SHIPPING METHOD
  // ---------------------------
  doc.setFont("helvetica", "bold");
  doc.text("Shipping Method:", margin, y);

  doc.setFont("helvetica", "normal");
  doc.text(poDetails?.shippingMethod || "Standard", margin + 40, y);

  y += 12;

  // ---------------------------
  // ITEMS TABLE HEADER
  // ---------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description", margin, y);
  doc.text("Qty", margin + pageWidth - 90, y);
  doc.text("Unit Price", margin + pageWidth - 60, y);
  doc.text("Total", margin + pageWidth - 25, y);

  y += 4;
  doc.setDrawColor(lightGray);
  doc.line(margin, y, margin + pageWidth, y);
  y += 8;

  // ---------------------------
  // ITEMS (REAL DATA)
  // ---------------------------
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  (poItems || []).forEach(item => {
    if (!item?.itemName) return;

    checkPageBreak(10);

    const qty = item.quantity || "0";
    const price = parseFloat(item.unitPrice || 0).toFixed(2);
    const total = (parseFloat(qty) * parseFloat(price)).toFixed(2);

    doc.text(item.itemName, margin, y);
    doc.text(qty.toString(), margin + pageWidth - 90, y);
    doc.text(`$${price}`, margin + pageWidth - 60, y);
    doc.text(`$${total}`, margin + pageWidth - 25, y);

    y += 8;
  });

  // ---------------------------
  // USER REMARKS
  // ---------------------------
  if (poDetails?.notes) {
    y += 6;
    checkPageBreak(20);

    doc.setFont("helvetica", "bold");
    doc.text("User Remarks:", margin, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const remarkLines = doc.splitTextToSize(poDetails.notes, pageWidth);
    remarkLines.forEach(line => {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5;
    });
  }

  // ---------------------------
  // TERMS AND CONDITIONS ONLY
  // (Warranty & Liability removed)
  // ---------------------------
  if (output) {
    const termsMatch = output.match(/Terms and Conditions:?([\s\S]*?)(?=$)/i);

    if (termsMatch && termsMatch[1].trim()) {
      y += 10;
      checkPageBreak(20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Terms and Conditions:", margin, y);

      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const termsLines = doc.splitTextToSize(termsMatch[1].trim(), pageWidth);

      termsLines.forEach(line => {
        checkPageBreak(6);
        doc.text(line, margin, y);
        y += 5;
      });
    }
  }

  // ---------------------------
  // TOTALS
  // ---------------------------
  y += 10;
  checkPageBreak(30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(accent);
  doc.text("Totals", margin, y);

  y += 4;
  doc.setDrawColor(lightGray);
  doc.line(margin, y, margin + pageWidth, y);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(textGray);

  const totals = [
    ["Subtotal:", `$${poTotals?.subtotal || "0.00"}`],
    [`Tax (${poTotals?.taxRate || 0}%):`, `$${poTotals?.taxAmount || "0.00"}`],
    ["Grand Total:", `$${poTotals?.grandTotal || "0.00"}`]
  ];

  totals.forEach(([label, value]) => {
    checkPageBreak(10);
    doc.text(label, margin, y);
    doc.text(value, margin + pageWidth, y, { align: "right" });
    y += 8;
  });

  doc.save(`${poDetails?.poNumber || "PO"}_Official.pdf`);
};


//----end of poGenerator pdf download handler----//

// 4. DOWNLOAD HANDLER (connects to your generate() function)
//---------estimator pdf generation logic---------

const handleDownload = () => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = 20;

  // 1. Header & Title
  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("JOB ESTIMATE", margin, yPos);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, yPos);
  
  yPos += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, yPos, 190, yPos);
  yPos += 15;

  // 2. Project Info
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Project:", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(header.jobTitle || "Untitled Project", margin + 20, yPos);
  
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Customer:", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(header.customerName || "N/A", margin + 25, yPos);

  if (header.location) {
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Location:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(header.location, margin + 25, yPos);
  }
  
  yPos += 20;

  if (output) { // 'output' is the state variable holding your AI Overview
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.deepBlue);
  doc.text("Project Overview", margin, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60); // Dark grey for body text

  // Split the AI text so it wraps within the page margins
  const maxWidth = 170; 
  const wrappedOverview = doc.splitTextToSize(output, maxWidth);
  
  doc.text(wrappedOverview, margin, yPos);
  
  // Dynamically move yPos down based on the length of the overview
  yPos += (wrappedOverview.length * 5) + 10;
}

// 2. Check for Page Overflow
// If the overview was long, we might need a new page for the tables
if (yPos > 250) {
  doc.addPage();
  yPos = 20;
}

  // 3. Labor/Tasks Table
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, 170, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Services & Labor", margin + 2, yPos + 6);
  doc.text("Qty", margin + 110, yPos + 6);
  doc.text("Rate", margin + 130, yPos + 6);
  doc.text("Total", margin + 155, yPos + 6);
  
  yPos += 15;
  doc.setFont("helvetica", "normal");

  tasks.forEach((task) => {
    if (!task.desc) return;
    const lineTotal = (parseFloat(task.qty || 0) * parseFloat(task.rate || 0)).toFixed(2);
    doc.text(task.desc, margin + 2, yPos);
    doc.text(task.qty.toString(), margin + 110, yPos);
    doc.text(`$${task.rate}`, margin + 130, yPos);
    doc.text(`$${lineTotal}`, margin + 155, yPos);
    yPos += 8;
  });

  // 4. Materials Table (New)
  if (materials.some(m => m.desc)) {
    yPos += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Materials", margin + 2, yPos + 6);
    yPos += 15;
    doc.setFont("helvetica", "normal");

    materials.forEach((m) => {
  if (!m.desc) return;
  const lineTotal = (parseFloat(m.qty || 0) * parseFloat(m.cost || 0)).toFixed(2);
  
  doc.text(m.desc, margin + 2, yPos);
  
  // Combines Qty and Unit (e.g., "10 lbs")
  const qtyWithUnit = `${m.qty} ${m.uom || ""}`;
  doc.text(qtyWithUnit, margin + 110, yPos);
  
  doc.text(`$${parseFloat(m.cost).toFixed(2)}`, margin + 130, yPos);
  doc.text(`$${lineTotal}`, margin + 155, yPos);
  yPos += 8;
});
  }

  // 5. Fees & Calculations
  yPos += 10;
  doc.setDrawColor(200);
  doc.line(120, yPos, 190, yPos);
  yPos += 10;

  const rowHeight = 7;
  const labelX = 120;
  const valueX = 165;

  // Add Fees to breakdown
  fees.forEach(f => {
    if (parseFloat(f.amount) > 0) {
      doc.setFont("helvetica", "normal");
      doc.text(`${f.type}:`, labelX, yPos);
      doc.text(`$${parseFloat(f.amount).toFixed(2)}`, valueX, yPos);
      yPos += rowHeight;
    }
  });

  if (parseFloat(financials.discount) > 0) {
    doc.text("Discount:", labelX, yPos);
    doc.text(`-$${financials.discount}`, valueX, yPos);
    yPos += rowHeight;
  }

  // Final Total
  yPos += 10;
  doc.setDrawColor(230);
  doc.line(margin, yPos, 190, yPos); // Divider line
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.darkSlate);
  doc.text("Terms & Conditions", margin, yPos);
  
  yPos += 8;
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal"); // Set to normal for the entire block

  const maxWidth = 170;

  // Clean text array without special characters or bolding mid-line
  const cleanTerms = [
    "1. Scope of Work: This estimate is based solely on the information provided at the time of inspection. Only the items and services specifically listed in the estimate are included. Any additional work, hidden conditions, or changes requested by the customer will require a written change order and may result in additional charges.",
    "2. Exclusions: Unless explicitly stated, this estimate does not include: permits, engineering, design work, disposal fees, specialty materials, unforeseen structural issues, code upgrades, or repairs required due to pre-existing damage or unsafe conditions.",
    "3. Payment Terms: Payment is due according to the schedule listed in the estimate. A deposit may be required before work begins. Final payment is due immediately upon completion of the work. Late payments may incur additional fees.",
    "4. Change Orders: Any deviation from the original scope — including customer-requested changes, additional repairs, or unforeseen conditions — must be approved in writing. Change orders will be billed at the current labor and material rates.",
    "5. Delays: The business is not responsible for delays caused by weather, supply shortages, back-ordered materials, customer scheduling issues, or circumstances beyond our control. Such delays do not void this agreement.",
    "6. Warranty: Workmanship is warranted for 30 days unless otherwise stated. Warranty does not cover misuse, neglect, normal wear and tear, or issues caused by pre-existing conditions.",
    "7. Liability: The business is not liable for incidental, consequential, or indirect damages. Liability is limited to the total amount paid for the services.",
    "8. Cancellation: If the customer cancels after materials have been purchased or work has begun, the customer is responsible for all costs incurred up to the cancellation date.",
    "9. Ownership: All materials remain the property of the business until paid in full.",
    "10. Customer Responsibilities: The customer agrees to provide clear access to the work area, remove personal items, secure pets, and ensure utilities are available.",
    "11. Governing Law: This agreement is governed by the laws of the state in which the work is performed."
  ];

  cleanTerms.forEach((term) => {
    // Check for page overflow
    if (yPos > 275) {
      doc.addPage();
      yPos = 20;
    }

    // Wrap the full text block
    const wrappedText = doc.splitTextToSize(term, maxWidth);
    
    // Draw the text
    doc.text(wrappedText, margin, yPos);
    
    // Move yPos down based on number of lines + small gap between items
    yPos += (wrappedText.length * 4) + 4;
  });

  // SIGNATURE AREA
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Signature: ___________________________", margin, yPos);
  doc.text("Date: ________________", 130, yPos);

  // Save File

  
  doc.save(`Estimate_${header.customerName || "Client"}.pdf`);
};
//-----------------------------end of estimator pdf generation logic-----------------------------





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
            details,
          }
        : mode === "estimator"
      ? {
          mode,
          header,      // Sent as an object containing jobTitle, customerName, etc.
          tasks,       // Sent as an array of task objects
          materials,   // Sent as an array of material objects
          fees,
          financials,
          total: calculateTotal(), // Invokes your total calculation helper
        }
      : {
          // Default/Legacy modes (About Us, Responder, etc.)
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
          rawComments,
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
        data.estimate ||
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
              fontSize: "28px", margin: 0, fontWeight: "800", display: "inline-block",
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

          {/* ==========================================
              1. RENDER SNAPS - TOOL-SPECIFIC INPUTS
          ========================================== */}
          
          {/* About Us Snap */}
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

          {/* Responder Snap */}
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

          {/* Apology Snap */}
          {mode === "apology" && (
            <Apology
              issueType={issueType}
              setIssueType={setIssueType}
              apologyContext={apologyContext}
              setApologyContext={setApologyContext}
              inputStyle={inputStyle}
            />
          )}

          {/* Sentiment Snap */}
          {mode === "sentiment" && (
            <Sentiment
              rawComments={rawComments}
              setRawComments={setRawComments}
              inputStyle={inputStyle}
            />
          )}

          {/* Purchase Order Snap */}
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
              onDownload={handlePoDownload} 
            />
          )}

          {/* Job Estimator Snap */}
          {mode === "estimator" && colors && (
            <JobEstimator
              colors={colors}
              inputStyle={inputStyle}
              getInputStyle={getInputStyle}
              header={header}
              setHeader={setHeader}
              tasks={tasks}
              updateTask={updateTask}
              removeTask={removeTask}
              addTask={addTask}
              materials={materials}
              updateMaterial={updateMaterial}
              removeMaterial={removeMaterial}
              addMaterial={addMaterial}
              fees={fees}
              updateFee={updateFee}
              financials={financials}
              setFinancials={setFinancials}
              calculateTotal={calculateTotal}
              onDownload={handleDownload}
            />
          )}

          {/* Contracts Snap */}
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
              onDownload={handleContractDownload} 
              outputExists={!!output} 
            />
          )}

          {/* Policies & Compliance Snap */}
          {mode === "policies" && (
            <PoliciesCompliance
              policyType={policyType}
              setPolicyType={setPolicyType}
              businessName={businessName}
              setBusinessName={setBusinessName}
              details={details}
              setDetails={setDetails}
              colors={colors}
              inputStyle={inputStyle}
              onDownload={handlePoliciesDownload} 
            />
          )}

          {/* ==========================================
              2. SHARED ACTION BUTTONS (GENERATE/DOWNLOAD/SAVE)
          ========================================== */}
          
          <div style={{ 
            display: "flex", 
            gap: "12px", 
            marginTop: "25px", 
            width: "100%",
            marginBottom: "20px",
            alignItems: "stretch" 
          }}>
            {/* GENERATE BUTTON: Logic adapts text/color based on tool */}
            <button
              onClick={generate}
              disabled={loading}
              style={{
                flex: 2,
                padding: "16px",
                background: mode === "po" ? colors.poGreen : mode === "policies" ? colors.orange : colors.deepBlue,
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
              {loading ? "Snapping..." : `Generate ${mode === "po" ? "PO Data" : mode === "policies" ? "Policy" : "Snap"}`}
            </button>

            {/* DOWNLOAD BUTTON: Appears after AI generation is complete */}
            {output && (
              <button
                onClick={() => {
                  if (mode === "po") handlePoDownload();
                  else if (mode === "contracts") handleContractDownload();
                  else if (mode === "estimator") handleDownload();
                  else if (mode === "policies") handlePoliciesDownload();
                  else if (mode === "about") handleAboutDownload();
                  else if (mode === "responder") handleResponderDownload();
                  else if (mode === "apology") handleApologyDownload();
                  else if (mode === "sentiment") handleSentimentDownload();
                  else handleDownload();
                }}
                style={{
                  flex: 1,
                  padding: "16px",
                  background: "white",
                  color: mode === "po" ? colors.poGreen : mode === "policies" ? colors.orange : colors.deepBlue,
                  border: `2px solid ${mode === "po" ? colors.poGreen : mode === "policies" ? colors.orange : colors.deepBlue}`,
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Download PDF
              </button>
            )}

            {/* SAVE BUTTON: Placeholder with Subscriber subtext */}
            <button 
              disabled
              style={{
                flex: 1,
                padding: "12px 8px",
                background: "#f1f5f9", 
                color: "#94a3b8",      
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                cursor: "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px"
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>Save</span>
              <span style={{ fontSize: "10px", fontWeight: "normal", opacity: 0.8 }}>
                Subscribers save to DB
              </span>
            </button>
          </div>

          {/* ==========================================
              3. OUTPUT AREA (ERROR & AI RESULT)
          ========================================== */}
          
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
        </div> {/* End of main white container card */}

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