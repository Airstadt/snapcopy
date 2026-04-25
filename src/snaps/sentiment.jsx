import React from "react";

export default function Sentiment({ inputStyle, rawComments, setRawComments }) {
  return (
    <textarea 
      value={rawComments} 
      onChange={(e) => setRawComments(e.target.value)} 
      placeholder="Paste comments here..." 
      style={{ ...inputStyle, height: "150px", resize: "none" }} 
    />
  );
}