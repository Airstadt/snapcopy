import React from "react";

const Apology = ({ 
  colors, 
  inputStyle, 
  issueType, 
  setIssueType, 
  apologyContext, 
  setApologyContext 
}) => {
  return (
    <>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Issue Type</label>
      <select 
        value={issueType} 
        onChange={(e) => setIssueType(e.target.value)} 
        style={inputStyle}
      >
        <option value="">What went wrong?</option>
        <option value="delay">Service or Shipping Delay</option>
        <option value="quality">Workmanship / Quality Issue</option>
        <option value="communication">Poor Communication / No-Show</option>
        <option value="billing">Billing or Overcharge Dispute</option>
        <option value="behavior">Staff Behavior / Professionalism</option>
      </select>
      
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Context / Details</label>
      <textarea 
        value={apologyContext} 
        onChange={(e) => setApologyContext(e.target.value)} 
        placeholder="Provide context (e.g. 'We missed the appointment because of a truck breakdown')..." 
        style={{ ...inputStyle, height: "100px", resize: "none" }} 
      />
    </>
  );
};

export default Apology;