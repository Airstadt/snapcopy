// /src/pdf/pdfHandlers.js
import { jsPDF } from "jspdf";

// ------------------------------------------------------------
// DEFAULT COLOR PALETTE (embedded, but overrideable)
// ------------------------------------------------------------
const defaultColors = {
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

// Utility: merge custom colors if provided
const useColors = (custom) => ({ ...defaultColors, ...(custom || {}) });

// Utility: page break helper
const checkPageBreak = (doc, y, margin = 20) => {
  if (y > 270) {
    doc.addPage();
    return margin;
  }
  return y;
};

// ------------------------------------------------------------
// 1. ABOUT US PDF
// ------------------------------------------------------------
export function handleAboutPDF({ input, output, customColors }) {
  const colors = useColors(customColors);
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("COMPANY PROFILE", margin, y);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, y);

  y += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, y, 190, y);
  y += 20;

  if (output) {
    doc.setFontSize(11);
    doc.setTextColor(colors.textDark);
    const wrapped = doc.splitTextToSize(output, 170);
    doc.text(wrapped, margin, y);
  }

  doc.save(`${input?.businessName || "Company"}_Bio.pdf`);
}

// ------------------------------------------------------------
// 2. APOLOGY PDF
// ------------------------------------------------------------
export function handleApologyPDF({ input, output, customColors }) {
  const colors = useColors(customColors);
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("OFFICIAL CORRESPONDENCE", margin, y);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, y);

  y += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, y, 190, y);
  y += 20;

  if (input?.businessName) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(input.businessName.toUpperCase(), margin, y);
    y += 12;
  }

  if (output) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(output, 170);

    wrapped.forEach((line) => {
      y = checkPageBreak(doc, y);
      doc.text(line, margin, y);
      y += 7;
    });
  }

  y += 15;
  y = checkPageBreak(doc, y);
  doc.setFont("helvetica", "bold");
  doc.text("Sincerely,", margin, y);
  y += 10;
  doc.text(input?.businessName || "Management", margin, y);

  doc.save("Official_Apology.pdf");
}

// ------------------------------------------------------------
// 3. RESPONDER PDF
// ------------------------------------------------------------
export function handleResponderPDF({ input, output, customColors }) {
  const colors = useColors(customColors);
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("CUSTOMER RESPONSE", margin, y);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, y);

  y += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, y, 190, y);
  y += 20;

  if (input?.businessName) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(input.businessName.toUpperCase(), margin, y);
    y += 12;
  }

  if (output) {
    doc.setFont("helvetica", "bold");
    doc.text("DRAFTED RESPONSE:", margin, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(output, 170);

    wrapped.forEach((line) => {
      y = checkPageBreak(doc, y);
      doc.text(line, margin, y);
      y += 7;
    });
  }

  doc.save(`${input?.businessName || "Social"}_Response.pdf`);
}

// ------------------------------------------------------------
// 4. SENTIMENT PDF
// ------------------------------------------------------------
export function handleSentimentPDF({ input, output, customColors }) {
  const colors = useColors(customColors);
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("SENTIMENT ANALYSIS REPORT", margin, y);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 145, y);

  y += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, y, 190, y);
  y += 20;

  if (input?.businessName) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Analysis for: ${input.businessName.toUpperCase()}`, margin, y);
    y += 15;
  }

  if (output) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.deepBlue);
    doc.text("EXECUTIVE SUMMARY:", margin, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.textDark);

    const wrapped = doc.splitTextToSize(output, 170);

    wrapped.forEach((line) => {
      y = checkPageBreak(doc, y);
      doc.text(line, margin, y);
      y += 7;
    });
  }

  y += 15;
  y = checkPageBreak(doc, y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150);
  doc.text(
    "This report was generated via AI Sentiment Analysis for internal review purposes.",
    margin,
    y
  );

  doc.save(`${input?.businessName || "Business"}_Sentiment_Report.pdf`);
}


// ------------------------------------------------------------
// 8. JOB ESTIMATOR PDF
// ------------------------------------------------------------
export function handleEstimatorPDF({ input, output, customColors }) {
  const colors = useColors(customColors);
  const {
    header,
    tasks,
    materials,
    fees,
    financials
  } = input;

  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  const check = (space = 12) => {
    if (y + space > 275) {
      doc.addPage();
      y = margin;
    }
  };

  // HEADER
  doc.setFontSize(22);
  doc.setTextColor(colors.deepBlue);
  doc.text("JOB ESTIMATE", margin, y);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, y);

  y += 15;
  doc.setDrawColor(colors.deepBlue);
  doc.line(margin, y, 190, y);
  y += 15;

  // PROJECT INFO
  doc.setFontSize(12);
  doc.setTextColor(colors.textDark);

  doc.setFont("helvetica", "bold");
  doc.text("Project:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(header.jobTitle || "Untitled Project", margin + 25, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Customer:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(header.customerName || "N/A", margin + 30, y);

  if (header.location) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Location:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(header.location, margin + 30, y);
  }

  y += 20;

  // PROJECT OVERVIEW
  if (output) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.deepBlue);
    doc.text("Project Overview", margin, y);

    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.textDark);

    const wrapped = doc.splitTextToSize(output, 170);
    wrapped.forEach((line) => {
      check(6);
      doc.text(line, margin, y);
      y += 5;
    });

    y += 10;
  }

  // PAGE BREAK BEFORE TABLES
  if (y > 250) {
    doc.addPage();
    y = margin;
  }

  // LABOR TABLE
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, 170, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Services & Labor", margin + 2, y + 6);
  doc.text("Qty", margin + 110, y + 6);
  doc.text("Rate", margin + 130, y + 6);
  doc.text("Total", margin + 155, y + 6);

  y += 15;
  doc.setFont("helvetica", "normal");

  tasks.forEach((task) => {
    if (!task.desc) return;

    const lineTotal = (
      parseFloat(task.qty || 0) * parseFloat(task.rate || 0)
    ).toFixed(2);

    check(10);
    doc.text(task.desc, margin + 2, y);
    doc.text(String(task.qty), margin + 110, y);
    doc.text(`$${task.rate}`, margin + 130, y);
    doc.text(`$${lineTotal}`, margin + 155, y);

    y += 8;
  });

  // MATERIALS TABLE
  if (materials.some((m) => m.desc)) {
    y += 10;
    check(20);

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Materials", margin + 2, y + 6);

    y += 15;
    doc.setFont("helvetica", "normal");

    materials.forEach((m) => {
      if (!m.desc) return;

      const lineTotal = (
        parseFloat(m.qty || 0) * parseFloat(m.cost || 0)
      ).toFixed(2);

      check(10);
      doc.text(m.desc, margin + 2, y);
      doc.text(`${m.qty} ${m.uom || ""}`, margin + 110, y);
      doc.text(`$${parseFloat(m.cost).toFixed(2)}`, margin + 130, y);
      doc.text(`$${lineTotal}`, margin + 155, y);

      y += 8;
    });
  }

  // FEES + TOTALS
  y += 10;
  check(20);

  doc.setDrawColor(200);
  doc.line(120, y, 190, y);
  y += 10;

  const labelX = 120;
  const valueX = 165;
  const rowHeight = 7;

  fees.forEach((f) => {
    if (parseFloat(f.amount) > 0) {
      doc.text(`${f.type}:`, labelX, y);
      doc.text(`$${parseFloat(f.amount).toFixed(2)}`, valueX, y);
      y += rowHeight;
    }
  });

  if (parseFloat(financials.discount) > 0) {
    doc.text("Discount:", labelX, y);
    doc.text(`-$${financials.discount}`, valueX, y);
    y += rowHeight;
  }

  // TERMS & CONDITIONS
  y += 15;
  check(20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.darkSlate);
  doc.text("Terms & Conditions", margin, y);

  y += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);

  const terms = [
    "1. Scope of Work: This estimate is based solely on the information provided at the time of inspection...",
    "2. Exclusions: Unless explicitly stated, this estimate does not include permits, engineering, disposal fees...",
    "3. Payment Terms: Payment is due according to the schedule listed in the estimate...",
    "4. Change Orders: Any deviation from the original scope must be approved in writing...",
    "5. Delays: The business is not responsible for delays caused by weather or supply shortages...",
    "6. Warranty: Workmanship is warranted for 30 days unless otherwise stated...",
    "7. Liability: Liability is limited to the total amount paid for the services...",
    "8. Cancellation: Customer is responsible for costs incurred up to cancellation...",
    "9. Ownership: Materials remain property of the business until paid in full...",
    "10. Customer Responsibilities: Customer must provide access, utilities, and remove personal items...",
    "11. Governing Law: This agreement is governed by the laws of the state of service."
  ];

  terms.forEach((t) => {
    check(10);
    const wrapped = doc.splitTextToSize(t, 170);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 4 + 4;
  });

  // SIGNATURE
  y += 10;
  check(20);

  doc.setFont("helvetica", "bold");
  doc.text("Signature: ___________________________", margin, y);
  doc.text("Date: ________________", 130, y);

  doc.save(`Estimate_${header.customerName || "Client"}.pdf`);
}

// ------------------------------------------------------------
// 5. POLICIES PDF
// ------------------------------------------------------------
export function handlePoliciesPDF({ input, output, customColors }) {
  const colors = useColors(customColors);
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(22);
  doc.setTextColor(colors.orange);
  doc.text(input.policyType?.toUpperCase() || "BUSINESS POLICY", margin, y);

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Official Document for: ${input.businessName || "N/A"}`, margin, y);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 140, y);

  y += 10;
  doc.setDrawColor(colors.orange);
  doc.line(margin, y, 190, y);
  y += 15;

  doc.setFontSize(11);
  doc.setTextColor(colors.textDark);

  const wrapped = doc.splitTextToSize(output, 170);

  wrapped.forEach((line) => {
    y = checkPageBreak(doc, y);
    doc.text(line, margin, y);
    y += 6;
  });

  const fileName = `${input.businessName?.replace(/\s+/g, "_") || "Business"}_${input.policyType?.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}

// ------------------------------------------------------------
// 6. CONTRACT PDF
// ------------------------------------------------------------
export function handleContractPDF({ input, output, customColors }) {
  const colors = useColors(customColors);
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(20);
  doc.setTextColor(colors.purple);
  doc.text(input.contractType?.toUpperCase() || "LEGAL AGREEMENT", margin, y);

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, y);

  y += 10;
  doc.setDrawColor(colors.purple);
  doc.line(margin, y, 190, y);
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.text("BETWEEN:", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.text(`Party A: ${input.partyA || "N/A"}`, margin, y);
  y += 6;
  doc.text(`Party B: ${input.partyB || "N/A"}`, margin, y);
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.text("AGREEMENT TERMS:", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  const wrapped = doc.splitTextToSize(output, 170);

  wrapped.forEach((line) => {
    y = checkPageBreak(doc, y);
    doc.text(line, margin, y);
    y += 6;
  });

  y += 20;
  y = checkPageBreak(doc, y);

  doc.setFont("helvetica", "bold");
  doc.text("Signatures:", margin, y);
  y += 15;

  doc.text("__________________________", margin, y);
  doc.text("__________________________", 110, y);
  y += 5;

  doc.setFontSize(9);
  doc.text(`For: ${input.partyA || "Party A"}`, margin, y);
  doc.text(`For: ${input.partyB || "Party B"}`, 110, y);

  doc.save(`${input.contractType?.replace(/\s+/g, "_")}_Agreement.pdf`);
}

// ------------------------------------------------------------
// 7. PURCHASE ORDER PDF
// ------------------------------------------------------------
export function handlePoPDF({ input, customColors }) {
  const colors = useColors(customColors);
  const {
    buyerInfo,
    vendorInfo,
    poDetails,
    poItems,
    poTotals
  } = input;

  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width - margin * 2;
  const pageHeight = doc.internal.pageSize.height;
  let y = margin;

  const check = (space = 12) => {
    if (y + space > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // HEADER
 
  doc.rect(0, 0, doc.internal.pageSize.width, 28, "F");
  doc.setDrawColor(colors.poGreen);
  doc.setLineWidth(1);
  doc.line(0, 28, doc.internal.pageSize.width, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(colors.poGreen);
  doc.text("Purchase Order", margin + 8, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(colors.textDark);
  doc.text(`PO #: ${poDetails?.poNumber || "N/A"}`, margin + pageWidth - 8, 16, { align: "right" });
  doc.text(`Date: ${poDetails?.poDate || "N/A"}`, margin + pageWidth - 8, 22, { align: "right" });

  y = 40;
  doc.setDrawColor(colors.poGreen);
  doc.line(margin, y, margin + pageWidth, y);
  y += 16;

  // ADDRESS BOXES
  const boxHeight = 70;
  const halfWidth = pageWidth / 2 - 8;


  doc.roundedRect(margin, y, halfWidth, boxHeight, 4, 4, "F");
  doc.roundedRect(margin + halfWidth + 16, y, halfWidth, boxHeight, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colors.poGreen);
  doc.text("Bill To", margin + 6, y + 10);
  doc.text("Ship To", margin + 6, y + 38);
  doc.text("Ship From", margin + halfWidth + 22, y + 10);

  doc.setLineWidth(0.6);
  doc.line(margin + 6, y + 13, margin + halfWidth - 6, y + 13);
  doc.line(margin + 6, y + 41, margin + halfWidth - 6, y + 41);
  doc.line(margin + halfWidth + 22, y + 13, margin + pageWidth - 6, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(colors.textDark);

  doc.text(buyerInfo?.companyName || "N/A", margin + 6, y + 22);
  doc.text(buyerInfo?.companyAddress || "", margin + 6, y + 28);
  doc.text(buyerInfo?.shipToName || buyerInfo?.companyName || "N/A", margin + 6, y + 50);
  doc.text(buyerInfo?.shipToAddress || buyerInfo?.companyAddress || "", margin + 6, y + 56);

  const shipFromX = margin + halfWidth + 22;
  const shipFromWidth = halfWidth - 28;
  const wrappedShipFrom = doc.splitTextToSize(vendorInfo?.vendorAddress || "", shipFromWidth);
  doc.text(vendorInfo?.vendorName || "N/A", shipFromX, y + 22);
  doc.text(wrappedShipFrom, shipFromX, y + 28);

  y += boxHeight + 15;

  // ITEMS TABLE
  doc.setFont("helvetica", "bold");
  doc.text("Description", margin, y);
  doc.text("Qty", margin + pageWidth - 90, y);
  doc.text("Unit Price", margin + pageWidth - 60, y);
  doc.text("Total", margin + pageWidth - 25, y);

  y += 4;
  doc.setDrawColor(colors.lightGray);
  doc.line(margin, y, margin + pageWidth, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  poItems.forEach((item) => {
    if (!item?.itemName) return;
    check(15);

    const qty = item.quantity || "0";
    const price = parseFloat(item.unitPrice || 0).toFixed(2);
    const total = (parseFloat(qty) * parseFloat(price)).toFixed(2);

    doc.text(item.itemName, margin, y);
    doc.text(qty.toString(), margin + pageWidth - 90, y);
    doc.text(`$${price}`, margin + pageWidth - 60, y);
    doc.text(`$${total}`, margin + pageWidth - 25, y);
    y += 7;

    if (item.lineNotes?.trim()) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      const wrapped = doc.splitTextToSize(`Note: ${item.lineNotes}`, pageWidth - 25);
      wrapped.forEach((line) => {
        check(6);
        doc.text(line, margin + 5, y);
        y += 5;
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 2;
    }

    doc.setDrawColor(colors.lightGray);
    doc.line(margin, y, margin + pageWidth, y);
    y += 6;
  });

  
  // TOTALS
y += 10;
check(35);

doc.setFont("helvetica", "bold");
doc.setTextColor(colors.poGreen);
doc.text("Totals", margin, y);

y += 4;
doc.line(margin, y, margin + pageWidth, y);
y += 10;

doc.setFont("helvetica", "normal");
doc.setTextColor(colors.textDark);

const totals = [
  ["Subtotal:", `$${poTotals.subtotal}`],
  [`Tax (${poTotals.taxRate || 0}%):`, `$${poTotals.taxAmount}`],
  ["Shipping:", `$${poTotals.shippingCost || "0.00"}`],
  ["Grand Total:", `$${poTotals.grandTotal}`]
];

  totals.forEach(([label, value]) => {
    check(10);
    doc.text(label, margin + pageWidth - 60, y);
    doc.text(value, margin + pageWidth - 10, y, { align: "right" });
    y += 7;
  });

  // NOTES SECTION
  y += 15;
  check(20);

  if (poDetails?.notes?.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.poGreen);
    doc.text("Additional Notes:", margin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.textDark);

    const wrappedNotes = doc.splitTextToSize(poDetails.notes, pageWidth);
    wrappedNotes.forEach((line) => {
      check(6);
      doc.text(line, margin, y);
      y += 6;
    });
  }

  // FOOTER
  y = pageHeight - 20;
  doc.setFontSize(9);
  doc.setTextColor(colors.footerText);
  doc.text(
    "This Purchase Order was generated using SnapCopy — AI tools for growing businesses.",
    margin,
    y
  );

  doc.save(`PO_${poDetails?.poNumber || "Document"}.pdf`);
}
