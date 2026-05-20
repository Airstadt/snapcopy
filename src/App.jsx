import { BrowserRouter as Router, Routes, Route, Link, useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { auth } from "./firebase";
import { jsPDF } from "jspdf";
import { db } from "./firebase";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./hooks/useAuth";
import { useNavigate } from "react-router-dom";
import UpgradeScreen from "./UpgradeScreen";
import { gsap } from "gsap";




import snapcopyLogo from "./assets/snapcopyLogo.png";
import airStadtLogo from "./assets/AirStadtLogo.png";

import MarketingHome from "./pages/MarketingHome";
import SnapWorkspace from "./components/SnapWorkspace";

import InterestForm from "./pages/InterestForm";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileSettings from "./pages/settings/ProfileSettings";
import BillingSettings from "./pages/settings/BillingSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import SettingsHome from "./pages/settings/SettingsHome";
import SnapDetail from "./pages/SnapDetail";


import JobEstimator from "./snaps/jobEstimator";
import AboutUs from "./snaps/AboutUs";
import Responder from "./snaps/Responder";
import Apology from "./snaps/Apology";
import Sentiment from "./snaps/Sentiment";
import PoGenerator from "./snaps/PoGenerator";
import Contracts from "./snaps/Contracts";
import PoliciesCompliance from "./snaps/Policies.jsx";
import MySnaps from "./pages/MySnaps";
import "jspdf-autotable";


function HomePage() {
  // --- STATE MANAGEMENT ---
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [mode, setMode] = useState("about");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [years, setYears] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [customBusinessType, setCustomBusinessType] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [responderMessage, setResponderMessage] = useState("");

  const [tone, setTone] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [apologyContext, setApologyContext] = useState("");
  const [rawComments, setRawComments] = useState("");

  const [policyType, setPolicyType] = useState("");
  const [details, setDetails] = useState("");
  const [businessName, setBusinessName] = useState("");
  const { user, profile } = useAuth();

  const [contractType, setContractType] = useState("");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [scope, setScope] = useState("");
  const [terms, setTerms] = useState("");
  const [specialClauses, setSpecialClauses] = useState("");

useEffect(() => {
  const wrapper = document.querySelector(".meter-wrapper");
  const wave = document.querySelector(".meter-wave");

  if (!wrapper || !wave) return;

  const wrapperWidth = wrapper.offsetWidth;
  const waveWidth = wave.offsetWidth;

  gsap.fromTo(
    wave,
    { x: -waveWidth, scaleY: 0.3 },
    {
      x: wrapperWidth,
      scaleY: 2,
      duration: 2.5,
      ease: "power2.inOut",
      repeat: -1,
    }
  );
}, []);











  // ⬆️ END — this is the ONLY correct place

  // ... all your other state + helpers ...

  

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
//-------------------------------------------end Policies pdf download handler-----------------------------------//
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
// --- -------------------------------------------Contracts PDF Download Handler -----------------------------//
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
  // --- SCOPE SAFETY: Prevent ReferenceErrors ---
  // If variables are undefined, these defaults prevent the crash
  const currentPoTotals = typeof poTotals !== 'undefined' ? poTotals : { subtotal: "0.00", taxRate: 0, taxAmount: "0.00", grandTotal: "0.00" };
  const currentPoItems = typeof poItems !== 'undefined' ? poItems : [];
  const currentPoDetails = typeof poDetails !== 'undefined' ? poDetails : {};
  const currentBuyerInfo = typeof buyerInfo !== 'undefined' ? buyerInfo : {};
  const currentVendorInfo = typeof vendorInfo !== 'undefined' ? vendorInfo : {};
  // ---------------------------------------------

  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width - margin * 2;
  const pageHeight = doc.internal.pageSize.height;
  let y = margin;

  const accent = "#2E7D32"; // Standardized green
  const textGray = "#333333";
  const lightGray = "#E0E0E0";

  const checkPageBreak = (space = 12) => {
    if (y + space > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // --- HEADER ---
  doc.setFillColor(245, 245, 245); 
  doc.rect(0, 0, doc.internal.pageSize.width, 28, "F");
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(1);
  doc.line(0, 28, doc.internal.pageSize.width, 28);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 4, pageWidth, 22, 3, 3, "F");
  doc.setFont("Sprite Graffiti", "bold");
  doc.setFontSize(20);
  doc.setTextColor(46, 125, 50);
  doc.text("Purchase Order", margin + 8, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(textGray);
  doc.text(`PO #: ${currentPoDetails?.poNumber || "N/A"}`, margin + pageWidth - 8, 16, { align: "right" });
  doc.text(`Date: ${currentPoDetails?.poDate || "N/A"}`, margin + pageWidth - 8, 22, { align: "right" });

  y = 40;
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + pageWidth, y);
  y += 16;

  // --- ADDRESS BOXES ---
  const boxHeight = 70;
  const halfWidth = pageWidth / 2 - 8;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, y, halfWidth, boxHeight, 4, 4, "F");
  doc.roundedRect(margin + halfWidth + 16, y, halfWidth, boxHeight, 4, 4, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(46, 125, 50);
  doc.text("Bill To", margin + 6, y + 10);
  doc.text("Ship To", margin + 6, y + 38);
  doc.text("Ship From", margin + halfWidth + 22, y + 10);

  doc.setLineWidth(0.6);
  doc.line(margin + 6, y + 13, margin + halfWidth - 6, y + 13);
  doc.line(margin + 6, y + 41, margin + halfWidth - 6, y + 41);
  doc.line(margin + halfWidth + 22, y + 13, margin + pageWidth - 6, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(textGray);
  doc.text(currentBuyerInfo?.companyName || "N/A", margin + 6, y + 22);
  doc.text(currentBuyerInfo?.companyAddress || "", margin + 6, y + 28);
  doc.text(currentBuyerInfo?.shipToName || currentBuyerInfo?.companyName || "N/A", margin + 6, y + 50);
  doc.text(currentBuyerInfo?.shipToAddress || currentBuyerInfo?.companyAddress || "", margin + 6, y + 56);


  // --- SHIP FROM (Right Box) ---
const shipFromX = margin + halfWidth + 22;
const shipFromWidth = halfWidth - 28; // keeps text inside the box

doc.text(currentVendorInfo?.vendorName || "N/A", shipFromX, y + 22);

// Wrap address text
const wrappedShipFrom = doc.splitTextToSize(
  currentVendorInfo?.vendorAddress || "",
  shipFromWidth
);

// Print wrapped lines
doc.text(wrappedShipFrom, shipFromX, y + 28);

  y += boxHeight + 15;

  // --- ITEMS TABLE ---
  doc.setFont("helvetica", "bold");
  doc.text("Description", margin, y);
  doc.text("Qty", margin + pageWidth - 90, y);
  doc.text("Unit Price", margin + pageWidth - 60, y);
  doc.text("Total", margin + pageWidth - 25, y);
  y += 4;
  doc.setDrawColor(lightGray);
  doc.line(margin, y, margin + pageWidth, y);
  y += 8;

  // --- SINGLE LOOP FOR ITEMS ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  currentPoItems.forEach(item => {
    if (!item?.itemName) return;
    checkPageBreak(15);

    const qty = item.quantity || "0";
    const price = parseFloat(item.unitPrice || 0).toFixed(2);
    const total = (parseFloat(qty) * parseFloat(price)).toFixed(2);

    doc.text(item.itemName, margin, y);
    doc.text(qty.toString(), margin + pageWidth - 90, y);
    doc.text(`$${price}`, margin + pageWidth - 60, y);
    doc.text(`$${total}`, margin + pageWidth - 25, y);
    y += 7;

    // Line notes inside the same loop
    if (item.lineNotes && item.lineNotes.trim() !== "") {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      const wrapped = doc.splitTextToSize(`Note: ${item.lineNotes}`, pageWidth - 25);
      wrapped.forEach(line => {
        checkPageBreak(6);
        doc.text(line, margin + 5, y);
        y += 5;
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 2;
    }

    doc.setDrawColor("#E0E0E0");
    doc.line(margin, y, margin + pageWidth, y);
    y += 6;
  });

  // --- TOTALS ---
  y += 10;
  checkPageBreak(35);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accent);
  doc.text("Totals", margin, y);
  y += 4;
  doc.line(margin, y, margin + pageWidth, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(textGray);
  const totals = [
  ["Subtotal:", `$${currentPoTotals.subtotal}`],
  [`Tax (${currentPoTotals.taxRate || 0}%):`, `$${currentPoTotals.taxAmount}`],
  ["Shipping:", `$${currentPoTotals.shippingCost || "0.00"}`],
  ["Grand Total:", `$${currentPoTotals.grandTotal}`]
  ];

  totals.forEach(([label, value]) => {
    doc.text(label, margin, y);
    doc.text(value, margin + pageWidth, y, { align: "right" });
    y += 8;
  });

  doc.save(`${currentPoDetails?.poNumber || "PO"}_Official.pdf`);
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
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "white",
  color: "#1f2937",
  fontSize: "15px",
  marginBottom: "16px",
  outline: "none",
  transition: "0.2s ease"
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
  // ---------------------- GENERATE FUNCTION ----------------------
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
      : mode === "estimator"
      ? {
          mode,
          header,
          tasks,
          materials,
          fees,
          financials,
          total: calculateTotal()
        }
      : {
          mode,
          companyName,
          industry,
          city,
          years,
          businessType,
          customBusinessType,
          tone,
          description:
            mode === "about"
              ? aboutDescription
              : mode === "responder"
              ? responderMessage
              : description,
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
      data.estimate ||
      JSON.stringify(data, null, 2);

    setOutput(typeof result === "string" ? result : JSON.stringify(result, null, 2));
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}


// ---------------------- SAVE SNAP FUNCTION ----------------------
async function saveSnap() {
  console.log("saveSnap() fired");

  // 1. Check user
  if (!auth.currentUser) {
    console.log("❌ No user logged in");
    alert("You must be logged in to save snaps.");
    return;
  }

  // 2. Check plan
  if (profile?.plan !== "pro") {
    console.log("❌ User is not Pro. plan =", profile?.plan);
    alert("Saving snaps is a Pro feature. Upgrade to unlock unlimited saves.");
    return;
  }

  // 3. Check output
  if (!output) {
    console.log("❌ No output to save");
    alert("Generate a Snap before saving.");
    return;
  }

  const uid = auth.currentUser.uid;
  console.log("✔ User:", uid);

  // Build input payload
  const inputData =
    mode === "po"
      ? { buyerInfo, vendorInfo, poDetails, poItems, poTotals }
      : mode === "contracts"
      ? { contractType, partyA, partyB, scope, terms, specialClauses }
      : mode === "policies"
      ? { policyType, businessName, details }
      : mode === "estimator"
      ? { header, tasks, materials, fees, financials }
      : mode === "about"
      ? { industry, city, years, businessType, customBusinessType, aboutDescription }
      : mode === "responder"
      ? { businessType, customBusinessType, tone, responderMessage }
      : mode === "apology"
      ? { issueType, apologyContext }
      : mode === "sentiment"
      ? { rawComments }
      : {};

  // Auto title
  const title =
    mode === "about"
      ? `${industry || "Business"} About Us`
      : mode === "responder"
      ? `Response (${tone || "Neutral"})`
      : mode === "apology"
      ? `Apology – ${issueType || "General"}`
      : mode === "sentiment"
      ? `Sentiment Analysis`
      : mode === "contracts"
      ? `${contractType || "Contract"}`
      : mode === "policies"
      ? `${policyType || "Policy"}`
      : mode === "po"
      ? `Purchase Order ${poDetails.poNumber || ""}`
      : mode === "estimator"
      ? `Estimate – ${header.jobTitle || "Untitled"}`
      : "Snap";

  const snapDoc = {
    mode,
    title,
    input: inputData,
    output,
    createdAt: serverTimestamp()
  };

  try {
    console.log("📡 Writing to Firestore...");
    const snapRef = doc(collection(db, "users", uid, "snaps"));
    await setDoc(snapRef, snapDoc);
    console.log("✅ Firestore write success");
    alert("Snap saved successfully!");
  } catch (err) {
    console.error("🔥 Firestore Save Error:", err);
    alert("Failed to save snap. Check console for details.");
  }
}


// Make generate() callable from Snaps
window.generateSnap = generate;

// subtitle rotation component for hero section
function RotatingHeroText() {
  const messages = [
    "AI writing tools made for busy small business owners. Clear, confident, ready to send every time.",
    "Built for small business owners who don’t have hours to spend writing. Get clean, confident content the moment you need it.",
    "For small business owners who move fast. Get polished, professional writing without slowing down."
  ];

  const [index, setIndex] = useState(0);
  const [animState, setAnimState] = useState("in"); // "in" or "out"

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimState("out");

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setAnimState("in");
      }, 600); // slide-out duration
    }, 5500); // total duration per message

    return () => clearInterval(interval);
  }, []);

  // Inject keyframes once
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes glassPulse {
        0% { background: rgba(210, 180, 255, 0.35); }
        50% { background: rgba(230, 200, 255, 0.55); }
        100% { background: rgba(210, 180, 255, 0.35); }
      }

      @keyframes shimmerMove {
        0% { transform: translateX(-20%); opacity: 0.15; }
        50% { transform: translateX(20%); opacity: 0.25; }
        100% { transform: translateX(-20%); opacity: 0.15; }
      }

      @keyframes slideIn {
        0% { opacity: 0; transform: translateY(18px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideOut {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-18px); }
      }
        
            @keyframes movingPurpleGradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        maxWidth: "780px",
        margin: "0 auto 40px auto",
        padding: "40px 50px",
        borderRadius: "18px",
        backdropFilter: "blur(14px)",
        background: "linear-gradient(90deg, #d8b4fe, #c084fc, #a855f7, #c084fc, #d8b4fe)",
        backgroundSize: "300% 300%",
        animation: "movingPurpleGradient 12s ease-in-out infinite",
        border: "1px solid rgba(255, 255, 255, 0.45)",
        boxShadow: "0 12px 45px rgba(120, 60, 200, 0.18)",
        textAlign: "center",
      }}
    >

      {/* Shimmer layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-50%",
          width: "200%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
          animation: "shimmerMove 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <p
        style={{
          position: "relative",
          fontSize: "22px",
          color: "#ffffff",
          lineHeight: "1.55",
          margin: 0,
          minHeight: "70px",
          animation: animState === "in"
            ? "slideIn 0.6s ease forwards"
            : "slideOut 0.6s ease forwards",
        }}
      >
        {messages[index]}
      </p>
    </div>
  );
}





// end subtitle rotation component for hero section
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

    
    {/* SHOW ONLY FOR LOGGED-IN USERS */}
{auth.currentUser && (
  <button
    onClick={() => navigate("/dashboard")}
    style={{
      marginBottom: "20px",
      padding: "10px 20px",
      background: "#6c757d",
      color: "white",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Dashboard
  </button>
)}

    {/* ============================================================
        HERO SECTION — Logo, headline, subtext, CTA button
       ============================================================ */}
  <MarketingHome>
    {!user && (
  <>
  
    {/* HERO SECTION */}
    {/* HERO SECTION */}
{/* HERO SECTION */}
 <section 
      style={{
        maxWidth: 1000,
        textAlign: "center",
        padding: "80px 20px 70px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
        
      }}
    >
      
      <div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.4)",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: "18px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
  }}
>
  <span style={{ color: colors.deepBlue, fontWeight: "700" }}>⚡ AI powered</span>
  <span style={{ opacity: 0.6 }}>•</span>
  <span>built for business</span>
</div>

   <div style={{ position: "relative", marginBottom: 25, width: 160, height: 160 }}>
  
  {/* Swirling glow */}
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 150,
      height: 150,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: "conic-gradient(from 0deg, rgba(150, 80, 255, 0.25), rgba(93, 68, 119, 0.15), rgba(150, 80, 255, 0.25))",
      filter: "blur(40px)",
      animation: "swirlGlow 14s linear infinite",
      pointerEvents: "none",
      zIndex: 0,
    }}
  />

  {/* Actual logo */}
  <img
    src={snapcopyLogo}
    alt="SnapCopy Logo"
    style={{
      width: 160,
      height: 160,
      borderRadius: "50%",
      position: "relative",
      zIndex: 2,
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    }}
  />
</div>



      <h1
        style={{
          fontSize: "48px",
          fontWeight: "800",
          color: "#111827",
          marginBottom: "18px",
          lineHeight: "1.15",
          maxWidth: "800px"
        }}
      >
        Write Better. Respond Faster. Look Instantly Professional.
      </h1>

      {/* ⭐ NEW ROTATING GLOSSY TEXT */}
      <RotatingHeroText />

      {/* CTA BUTTONS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        <button className="fancy-card"
          onClick={scrollToForm}
          style={{
            padding: "16px 32px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${colors.deepBlue}, ${colors.deepBlue}CC)`,
            color: "white",
            fontSize: "17px",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            transition: "0.25s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.25)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Start Free — No Login Required
        </button>
      </div>
    </section>
  </>
)}




{/* TESTIMONIAL SECTION — only show to public visitors & non‑Pro */}
{profile?.plan !== "pro" && !user && (
  <section 
    style={{
      width: "100%",
      maxWidth: 1000,
      padding: "80px 20px",
      margin: "0 auto",
      textAlign: "center"
    }}
  >
    <h2
      style={{
        fontSize: "34px",
        fontWeight: "800",
        color: "#1f2937",
        marginBottom: "50px",
        lineHeight: "1.2"
      }}
    >
      What People Are Saying
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "30px",
        maxWidth: "900px",
        margin: "0 auto"
      }}
    >

      {/* Ric */}
      <div
        className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
          textAlign: "center"
        }}
      >
        <div style={{ marginBottom: "12px", fontSize: "18px", color: "#fbbf24" }}>
          ★★★★
        </div>

        <p
          style={{
            fontSize: "16px",
            color: "#113970",
            lineHeight: "1.6",
            marginBottom: "18px"
          }}
        >
          “This works great. It's straightforward instructions, targeted tasks, and clean responses. Need more!”
        </p>
   
        <h4
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: colors.deepBlue
          }}
        >
          Rick
        </h4>
      </div>

      {/* Christa */}
      <div
        className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
          textAlign: "center"
        }}
      >
        <div style={{ marginBottom: "12px", fontSize: "18px", color: "#fbbf24" }}>
          ★★★★★
        </div>

        <p
          style={{
            fontSize: "16px",
            color: "#4b5563",
            lineHeight: "1.6",
            marginBottom: "18px"
          }}
        >
          “Perfect for mom and pop shops. For people that don’t know how to use AI.”
        </p>

        <h4
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: colors.deepBlue
          }}
        >
          Anita
        </h4>
      </div>

    </div>
  </section>
)}


{/* VALUE PROPOSITION SECTION */}


{profile?.plan !== "pro" && (
  
  <section 
  style={{
    width: "100%",
    maxWidth: 1000,
    padding: "60px 20px",
    margin: "0 auto",
    textAlign: "center",
    position: "relative"
  }}
>
  <h2
    style={{
      fontSize: "36px",
      fontWeight: "800",
      color: "#1f2937",
      marginBottom: "40px",
      lineHeight: "1.2"
    }}
  >
    What Makes SnapCopy Different
  </h2>

  {/* Animated connecting line */}
  {/* Animated connecting line */}
<div
  className="meter-wrapper"
  style={{
    position: "absolute",
    top: 150,
    left: "5%",
    width: "90%",
    height: 3,
    background: "rgba(138,43,226,0.4)",
    overflow: "hidden",
    borderRadius: 2,
  }}
>
  <div
    className="meter-wave"
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      background: "rgba(138,43,226,1)",
      transformOrigin: "center",
      borderRadius: 10,
    }}
  />
</div>

{/* Animated connecting line */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "40px",
      marginTop: "20px",
      position: "relative",
      zIndex: 2
    }}
  >
    {/* 1. Save Hours */}
    <div style={{ padding: "10px 20px", position: "relative" }}>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: colors.orange,
          marginBottom: "12px"
        }}
      >
        Save Hours Every Week
      </h3>
      <p style={{ color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
        Stop wasting time writing emails, bios, policies, and customer replies.  
        SnapCopy handles the writing so you can stay focused on running your business.
      </p>
    </div>

    {/* 2. Look More Professional */}
    <div style={{ padding: "10px 20px", position: "relative" }}>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: colors.purple,
          marginBottom: "12px"
        }}
      >
        Look More Professional
      </h3>
      <p style={{ color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
        Every message comes out clean, confident, and polished — even if writing isn’t your thing.
      </p>
    </div>

    {/* 3. Win More Jobs */}
    <div style={{ padding: "10px 20px", position: "relative" }}>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: colors.orange,
          marginBottom: "12px"
        }}
      >
        Win More Jobs
      </h3>
      <p style={{ color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
        Better communication builds trust. Trust closes deals.  
        SnapCopy helps you sound sharp and stay ahead of competitors.
      </p>
    </div>

    {/* 4. Tools That Grow With You */}
    <div style={{ padding: "10px 20px", position: "relative" }}>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: colors.darkSlate,
          marginBottom: "12px"
        }}
      >
        Tools That Grow With You
      </h3>
      <p style={{ color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
        From About Us pages to contracts and purchase orders, SnapCopy keeps expanding  
        to support your business as it grows.
      </p>
    </div>
  </div>
</section>

)}
{/* END VALUE PROPOSITION SECTION */}

{/* VIDEO DEMO SECTION */}
{profile?.plan !== "pro" && (
<section id="demo" className="w-full min-h-screen flex items-center justify-center bg-[#0d0d0d] px-6 py-20">
  <div className="max-w-4xl w-full text-center">
    <h2 className="text-4xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
      See SnapCopy in Action
    </h2>
    <p className="text-gray-300 text-lg mb-10">
      A 32‑second demo showing how fast you can generate professional content.
    </p>

    {/* Video Container: inline styles force 50% of viewport, capped at 576px (max-w-xl) */}
    <div
      style={{
        width: '75vw',
        maxWidth: '960px',
        margin: '0 auto',
        aspectRatio: '16/9',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.08)',
        background: '#000'
      }}
    >
      <video
        src="https://pub-352990407c2f4e93846989d725d4526a.r2.dev/snapcopy%20demo%20aboutus.mp4"
        controls
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover'
        }}
      />
    </div>
  </div>
</section>
)}
{/* END VIDEO DEMO SECTION */}





{/* FEATURE GRID SECTION */}
{profile?.plan !== "pro" && (
  <section 
    style={{
      width: "100%",
      maxWidth: 1100,
      padding: "70px 20px",
      margin: "0 auto",
    }}
  >
    <h2 
      style={{
        fontSize: "34px",
        fontWeight: "800",
        color: "#1f2937",
        textAlign: "center",
        marginBottom: "50px",
        lineHeight: "1.2",
      }}
    >
      What You Can Create
    </h2>

    <div 
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "35px",
      }}
    >
      {/* About Us */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.deepBlue }}>
          About Us
        </h3>
        <p style={{ color: "#4b5563", marginTop: "12px", lineHeight: "1.55" }}>
          Clean, simple business bios that build trust.
        </p>
      </div>

      {/* Responder */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.purple }}>
          Responder
        </h3>
        <p style={{ color: "#4b5563", marginTop: "12px", lineHeight: "1.55" }}>
          Fast, confident replies for customers and clients.
        </p>
      </div>

      {/* Apology */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.orange }}>
          Apology
        </h3>
        <p style={{ color: "#4b5563", marginTop: "12px", lineHeight: "1.55" }}>
          Clear, respectful messages for tough situations.
        </p>
      </div>

      {/* Sentiment */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.darkSlate }}>
          Sentiment
        </h3>
        <p style={{ color: "#4b5563", marginTop: "12px", lineHeight: "1.55" }}>
          Quick breakdowns of positive, negative, and neutral feedback.
        </p>
      </div>

      {/* PO Generator */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.poGreen }}>
          PO Generator
        </h3>
        <p style={{ color: "#4b5563", marginTop: "12px", lineHeight: "1.55" }}>
          Ready‑to‑send purchase orders in seconds.
        </p>
      </div>

      {/* Contracts */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.deepBlue }}>
          Contracts
        </h3>
        <p style={{ color: "#4b5563", marginTop: "12px", lineHeight: "1.55" }}>
          Clear, simple agreements for everyday business.
        </p>
      </div>

      {/* Policies */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: `1px solid ${colors.lightGray}`,
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.orange }}>
          Policies
        </h3>
        <p style={{ color: "#4b5563", marginTop: "12px", lineHeight: "1.55" }}>
          Refund, warranty, and compliance policies written professionally.
        </p>
      </div>
    </div>
  </section>
)}
{/* END FEATURE GRID SECTION */}

{/* TRUSTED BY SECTION — only show to public visitors 

{!user && (
  <section
    style={{
      width: "100%",
      padding: "30px 20px",
      margin: "0 auto",
      textAlign: "center",
      opacity: 0.95
    }}
  >
    <p
      style={{
        fontSize: "18px",
        color: "#4b5563",
        fontWeight: "500",
        marginBottom: "20px"
      }}
    >
      Trusted by small business owners across the U.S.
    </p>

<div style={{ display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
*/}


  {/* Logo 1 — Angular Tech Mark 
  <svg width="80" height="40" viewBox="0 0 80 40">
    <path d="M20 28 L35 12 L50 28" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round"/>
  </svg>
*/}

  {/* Logo 2 — Split Hexagon 
  <svg width="80" height="40" viewBox="0 0 80 40">
    <polygon points="30,10 50,10 60,20 50,30 30,30 20,20" fill="none" stroke="#111" strokeWidth="4"/>
  </svg>
*/}

  {/* Logo 3 — Circle Slash 
  <svg width="80" height="40" viewBox="0 0 80 40">
    <circle cx="40" cy="20" r="12" stroke="#111" strokeWidth="4" fill="none"/>
    <line x1="32" y1="12" x2="48" y2="28" stroke="#111" strokeWidth="4"/>
  </svg>
*/}

  {/* Logo 4 — Stacked Tech Bars 
  <svg width="80" height="40" viewBox="0 0 80 40">
    <rect x="25" y="10" width="30" height="6" rx="2" fill="#111"/>
    <rect x="25" y="18" width="30" height="6" rx="2" fill="#111"/>
    <rect x="25" y="26" width="30" height="6" rx="2" fill="#111"/>
  </svg>
*/}

  {/* Logo 5 — Intersecting Lines 
  <svg width="80" height="40" viewBox="0 0 80 40">
    <path d="M25 12 L55 28 M55 12 L25 28" stroke="#111" strokeWidth="4" strokeLinecap="round"/>
  </svg>
*/}

  {/* Logo 6 — Minimal Arc Mark 
  <svg width="80" height="40" viewBox="0 0 80 40">
    <path d="M20 25 Q40 5 60 25" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round"/>
  </svg>

</div>
  </section>
)}
  */}

{/* END TRUSTED BY SECTION — only show to public visitors */}

</MarketingHome>
<SnapWorkspace>
  <div
    ref={formRef}
    style={{
      width: "100%",
      maxWidth: "900px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}
  >

    {/* NAV BUTTONS */}
    <nav
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        marginBottom: "var(--space-6)",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* ROW 1 */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%"
        }}
      >
        {[
          { key: "about", label: "About Us", color: colors.deepBlue },
          { key: "responder", label: "Responder", color: colors.deepBlue },
          { key: "apology", label: "Apology", color: colors.deepBlue },
          { key: "sentiment", label: "Sentiment", color: colors.deepBlue }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleModeSwitch(btn.key)}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "14px",
              background:
                mode === btn.key
                  ? `linear-gradient(135deg, ${btn.color}, ${btn.color}CC)`
                  : "rgba(17, 16, 16, 0.15)",
              color: "#00040a",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              transition: "0.25s ease",
              minWidth: "140px"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>




      {/* ROW 2 */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%"
        }}
      >
        {[
          { key: "po", label: "PO Generator", color: colors.orange  },
          { key: "estimator", label: "Job Estimator", color: colors.orange  },
          { key: "contracts", label: "Contracts", color: colors.orange  },
          { key: "policies", label: "Policies", color: colors.orange  }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleModeSwitch(btn.key)}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "14px",
              background:
                mode === btn.key
                  ? `linear-gradient(135deg, ${btn.color}, ${btn.color}CC)`
                  : "rgba(17, 16, 16, 0.15)",
              color: "#00040a",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              transition: "0.25s ease",
              minWidth: "140px"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </nav>

    {/* TOOL CONTENT */}
    <div
      style={{
        background: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: "24px",
        padding: "var(--space-8)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
        width: "100%",
        marginBottom: "var(--space-7)",
        position: "relative",
        zIndex: 2
      }}
    >
      {/* your tool content goes here */}
<button
  onClick={() => window.location.reload()}
  style={{
    marginTop: "10px",
    padding: "10px 22px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "14px",
    background: "#ef4444",
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "none";
  }}
>
  Clear Form
</button>

          
          <header style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2
    key={mode}
    style={{
      fontSize: "32px",
      margin: 0,
      fontWeight: "800",
      letterSpacing: "-0.5px",
      background:
        mode === "po"
          ? "linear-gradient(135deg, #2d6a4f, #38a169)"
          : "linear-gradient(135deg, #7c3aed, #4c1d95)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: "transparent",
      display: "inline-block",
      padding: "var(--space-2) var(--space-3)",
      borderRadius: "12px",
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

          

          {/* ==========================================
              1. RENDER SNAPS - TOOL-SPECIFIC INPUTS
          ========================================== */}
          
          {/* About Us Snap */}
          {mode === "about" && (
            <AboutUs
            companyName={companyName}
            setCompanyName={setCompanyName}
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
            description={aboutDescription}
            setDescription={setAboutDescription}
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
              description={responderMessage}
              setDescription={setResponderMessage}
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
            onClick={saveSnap}
            disabled={!output || loading}
            style={{
              flex: 1,
              padding: "12px 8px",
              background: output ? colors.deepBlue : "#f1f5f9",
              color: output ? "white" : "#94a3b8",
              border: output ? "none" : "1px solid #cbd5e1",
              borderRadius: "10px",
              cursor: output ? "pointer" : "not-allowed",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              transition: "0.2s"
            }}
          >
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Save
                  </span>
                  <span style={{ fontSize: "10px", opacity: 0.8 }}>
                    {profile?.plan === "pro" ? "Save to Dashboard" : "Pro Feature"}
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
                  padding: "var(--space-5)",
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
        </div>
          </SnapWorkspace>


{/* HOW IT WORKS — only show to non‑subscribed users */}

{/* END HOW IT WORKS — only show to non‑subscribed users */}

{/* FAQ SECTION — only show to non‑subscribed users */}

  {profile?.plan !== "pro" && (
  <section
    style={{
      width: "100%",
      maxWidth: 900,
      padding: "90px 20px",
      margin: "0 auto",
    }}
  >
    <h2
      style={{
        fontSize: "36px",
        fontWeight: "800",
        color: "#1f2937",
        textAlign: "center",
        marginBottom: "50px",
        lineHeight: "1.2"
      }}
    >
      Frequently Asked Questions
    </h2>

    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Q1 */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "26px",
          borderRadius: "14px",
          border: `1px solid ${colors.lightGray}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.deepBlue }}>
          Do I need an account to use SnapCopy?
        </h3>
        <p style={{ marginTop: "10px", color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
          No. You can generate Snaps instantly without creating an account. Accounts are only needed if you want to save your Snaps or upgrade to Pro.
        </p>
      </div>

      {/* Q2 */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "26px",
          borderRadius: "14px",
          border: `1px solid ${colors.lightGray}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.purple }}>
          Is SnapCopy really free?
        </h3>
        <p style={{ marginTop: "10px", color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
          Yes. All core Snaps are free to use. SnapCopy Pro will offer advanced tools, unlimited saves, and more.
        </p>
      </div>

      {/* Q3 */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "26px",
          borderRadius: "14px",
          border: `1px solid ${colors.lightGray}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.orange }}>
          What can I create with SnapCopy?
        </h3>
        <p style={{ marginTop: "10px", color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
          Business bios, customer replies, apologies, policies, contracts, purchase orders, sentiment analysis, and more.
        </p>
      </div>

      {/* Q4 */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "26px",
          borderRadius: "14px",
          border: `1px solid ${colors.lightGray}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.darkSlate }}>
          Who is SnapCopy for?
        </h3>
        <p style={{ marginTop: "10px", color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
          Small businesses, contractors, freelancers, and anyone who wants to look more professional without spending hours writing.
        </p>
      </div>

      {/* Q5 */}
      <div className="fancy-card"
        style={{
          background: "white",
          padding: "26px",
          borderRadius: "14px",
          border: `1px solid ${colors.lightGray}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.poGreen }}>
          What is SnapCopy Pro?
        </h3>
        <p style={{ marginTop: "10px", color: "#4b5563", lineHeight: "1.65", fontSize: "16px" }}>
          A premium version coming soon with unlimited saves, advanced tools, and priority features.
        </p>
      </div>

    </div>
  </section>
)}

<section
  style={{
    width: "100%",
    maxWidth: 900,
    margin: "80px auto 120px",
    padding: "40px 20px",
    textAlign: "center",
    position: "relative",
  }}
>

  {/* Section Title */}
  <h2
    style={{
      fontSize: "34px",
      fontWeight: "800",
      color: "#1f2937",
      marginBottom: "40px",
    }}
  >
   Pro Plan
  </h2>

  {/* Pricing Card Container */}
  <div
    style={{
      maxWidth: 420,
      margin: "0 auto",
      padding: "32px",
      borderRadius: "20px",

      // ⭐ Glass effect
      background: "rgba(255,255,255,0.55)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(255,255,255,0.35)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.08)",

      position: "relative",
    }}
  >

    {/* MOST POPULAR TAG */}
    <div
      style={{
        position: "absolute",
        top: "-14px",
        left: "50%",
        transform: "translateX(-50%)",
        background: colors.deepBlue,
        color: "white",
        padding: "6px 16px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      MOST POPULAR
    </div>

    {/* Plan Title */}
    <h3
      style={{
        fontSize: "24px",
        fontWeight: "800",
        color: colors.deepBlue,
        marginBottom: "10px",
        marginTop: "10px",
      }}
    >
      One price. Everytime all the time!
    </h3>

    {/* Price */}
    <div
      style={{
        fontSize: "42px",
        fontWeight: "800",
        color: "#111827",
        marginBottom: "20px",
      }}
    >
      $19.99 <span style={{ fontSize: "18px", color: "#6b7280" }}>/month</span>
    </div>

    {/* Feature List */}
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: "0 0 30px 0",
        textAlign: "left",
        lineHeight: "1.7",
        color: "#374151",
        fontSize: "16px",
      }}
    >
      <li>✔ No tokens per month</li>
      <li>✔ AI‑powered insights</li>
      <li>✔ Every feature included</li>
      <li>✔ Save content</li>
      <li>✔ Edit saved content</li>
      <li>✔ Download pdf, or clip for emails</li>
    </ul>

    {/* CTA Button */}
    <button
      onClick={scrollToForm}
      style={{
        width: "100%",
        padding: "14px 0",
        background: colors.deepBlue,
        color: "white",
        fontSize: "17px",
        fontWeight: "700",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        transition: "0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-3px)";
        e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "none";
      }}
    >
      Choose
    </button>

  </div>
</section>


{/* FINAL CTA — only show to public (non‑subscribed) users */}
{profile?.plan !== "pro" && !user && (
  <section
    style={{
      width: "100%",
      maxWidth: 900,
      padding: "90px 20px",
      margin: "0 auto",
      textAlign: "center"
    }}
  >
    <h2
      style={{
        fontSize: "36px",
        fontWeight: "800",
        color: "#1f2937",
        marginBottom: "22px",
        lineHeight: "1.2"
      }}
    >
      Ready to Look More Professional?
    </h2>

    <p
      style={{
        fontSize: "20px",
        color: "#4b5563",
        maxWidth: "620px",
        margin: "0 auto 40px auto",
        lineHeight: "1.6"
      }}
    >
      Start writing better emails, bios, policies, and customer replies in minutes —  
      no account or credit card required.
    </p>

    <button
      onClick={scrollToForm}
      style={{
        padding: "18px 36px",
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${colors.deepBlue}, ${colors.deepBlue}CC)`,
        color: "white",
        fontSize: "18px",
        fontWeight: "700",
        border: "none",
        cursor: "pointer",
        transition: "0.25s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-3px)";
        e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "none";
      }}
    >
      Start Free — No Account Needed
    </button>

    <p
      style={{
        marginTop: "18px",
        fontSize: "14px",
        color: "#9ca3af"
      }}
    >
      No credit card required. Cancel anytime.
    </p>
  </section>
)}


          
        {/* FOOTER */}
        <footer style={{ textAlign: "center", padding: "50px 0", borderTop: `1px solid ${colors.lightGray}` }}>
          <img src={airStadtLogo} alt="AirStadt Logo" style={{ height: 40, opacity: 0.8, marginBottom: 15 }} />
          <p style={{ color: colors.footerText, fontSize: "14px" }}>
            &copy; {new Date().getFullYear()} SnapCopy by AirStadt. All rights reserved.
          </p>
        </footer>
      
    </main>
  );
}




import Layout from "./Layout";


import SuccessPage from "./pages/SuccessPage"; // Make sure to create this file!

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/interest" element={<InterestForm />} />
          <Route path="/auth" element={<Auth />} />

          {/* New Success Route - Handles the redirect from Stripe */}
          <Route path="/success" element={<SuccessPage />} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />

          <Route
            path="/settings/profile"
            element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>}
          />

          <Route
            path="/settings/billing"
            element={<ProtectedRoute><BillingSettings /></ProtectedRoute>}
          />

          <Route
            path="/settings/security"
            element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>}
          />

          <Route
            path="/mysnaps"
            element={<ProtectedRoute><MySnaps /></ProtectedRoute>}
          />

          <Route path="/upgrade" element={<UpgradeScreen />} />

          <Route
            path="/snaps/:id"
            element={<ProtectedRoute><SnapDetail /></ProtectedRoute>}
          />

          <Route
            path="/settings"
            element={<ProtectedRoute><SettingsHome /></ProtectedRoute>}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

