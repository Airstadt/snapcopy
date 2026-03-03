import { useState, useEffect } from "react"; // Added useEffect for SEO
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function InterestForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // --- SEO INJECTION ---
  useEffect(() => {
    document.title = "Join the Priority Waitlist | SnapCopy AI Business Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Register for exclusive access to SnapCopy's AI Micro SaaS tools. Get custom AI content solutions and enterprise-level automation for your business.");
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    businessType: "",
    companySize: "",
    primaryUseCase: "",
    accessLevel: "",
    additionalNotes: "",
    hp_field: "" // [HONEYPOT STATE]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // [HONEYPOT CHECK]
    if (formData.hp_field !== "") {
      console.warn("Bot submission detected.");
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const { hp_field, ...dataToSave } = formData;

      await addDoc(collection(db, "leads"), {
        ...dataToSave,
        createdAt: serverTimestamp(),
      });
      alert("Thank you for your interest! We've added you to our priority list.");
      navigate("/"); 
    } catch (err) {
      console.error("Firestore Error:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "15px",
    width: "100%",
    boxSizing: "border-box"
  };

  const sectionHeaderStyle = {
    color: "#860aa5",
    fontSize: "22px",
    marginBottom: "15px",
    fontWeight: "700"
  };

  const listItemStyle = {
    marginBottom: "8px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px"
  };

  return (
    <main style={{ // Changed to <main> for SEO
      width: "100vw",
      margin: "0",
      padding: "0",
      left: "0",
      top: "0",
      position: "relative"
    }}>
      {/* GLOBAL OVERRIDE to prevent the white strip and margin issues */}
      <style>{`
        body, html { 
          margin: 0 !important; 
          padding: 0 !important; 
          overflow-x: hidden !important;
          background-color: #f7fafc !important;
        }
      `}</style>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f7fafc",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
        padding: "4rem 2rem",
      }}>

        {/* --- PAGE TITLE (Centered Top) --- */}
        <header style={{ textAlign: "center", marginBottom: "60px", width: "100%", maxWidth: "900px" }}>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#2d3748", marginBottom: "15px" }}>
            Partner With Us for Smarter Business Solutions
          </h1>
          <div style={{ width: "80px", height: "5px", background: "#860aa5", margin: "0 auto", borderRadius: "10px" }}></div>
        </header>

        {/* --- CONTENT AREA (Form + Sidebar) --- */}
        <div style={{
          maxWidth: "1150px", 
          width: "100%",
          display: "flex",
          flexWrap: "wrap", 
          gap: "60px",
          alignItems: "flex-start",
          justifyContent: "center"
        }}>

          {/* LEFT COLUMN: The Form */}
          <section style={{ flex: "1 1 550px", maxWidth: "650px" }} aria-labelledby="form-heading">
            <div style={{ marginBottom: "30px" }}>
              <h2 id="form-heading" style={{ fontSize: "28px", color: "#860aa5", marginBottom: "10px" }}>
                Exclusive Access & Custom Solutions
              </h2>
              <p style={{ color: "#718096", lineHeight: "1.6" }}>
                Join our priority waitlist for private tool access, enterprise features, or custom SaaS development.
              </p>
            </div>

            <form 
              onSubmit={handleSubmit}
              aria-label="Waitlist registration form"
              style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "20px",
                background: "white",
                padding: "40px",
                borderRadius: "15px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                width: "100%",
                boxSizing: "border-box"
              }}
            >
              {/* [HONEYPOT INPUT] */}
              <div style={{ display: "none" }} aria-hidden="true">
                  <input 
                      type="text" 
                      name="website_url_verify" 
                      tabIndex="-1" 
                      autoComplete="off"
                      onChange={(e) => setFormData({...formData, hp_field: e.target.value})}
                  />
              </div>

              <div>
                <label htmlFor="fullName" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Full Name *</label>
                <input id="fullName" required style={fieldStyle} placeholder="John Doe" 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Email Address *</label>
                <input id="email" type="email" required style={fieldStyle} placeholder="john@company.com" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div>
                <label htmlFor="phone" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Phone Number</label>
                <input id="phone" style={fieldStyle} placeholder="(555) 000-0000" 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label htmlFor="companyName" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Company Name</label>
                <input id="companyName" style={fieldStyle} placeholder="Acme Corp" 
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
            </div>

              <div style={{ gridColumn: "span 2" }}>
                <label htmlFor="website" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Website or Social Link</label>
                <input id="website" style={fieldStyle} placeholder="https://..." 
                  onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>

              <div>
                <label htmlFor="businessType" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Business Type</label>
                <select id="businessType" required style={fieldStyle} onChange={(e) => setFormData({...formData, businessType: e.target.value})}>
                  <option value="">Select Industry...</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Trades">Trades (HVAC, Roofing, etc.)</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="companySize" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Company Size</label>
                <select id="companySize" required style={fieldStyle} onChange={(e) => setFormData({...formData, companySize: e.target.value})}>
                  <option value="">Select Size...</option>
                  <option value="Solo">Solo</option>
                  <option value="2-5">2–5 employees</option>
                  <option value="6-20">6–20 employees</option>
                  <option value="21-50">21–50 employees</option>
                  <option value="51+">51+ employees</option>
                </select>
              </div>

              <div>
                <label htmlFor="useCase" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Primary Use Case</label>
                <select id="useCase" required style={fieldStyle} onChange={(e) => setFormData({...formData, primaryUseCase: e.target.value})}>
                  <option value="">Select Use Case...</option>
                  <option value="Content creation">Content Creation</option>
                  <option value="Automation">Process Automation</option>
                  <option value="Onboarding">Client Onboarding</option>
                  <option value="Customer communication">Customer Communication</option>
                  <option value="Analytics">Data Analytics</option>
                </select>
              </div>
              <div>
                <label htmlFor="accessLevel" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Access Level Interest</label>
                <select id="accessLevel" required style={fieldStyle} onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}>
                  <option value="">Select Interest...</option>
                  <option value="Private Single Tool">Private Single Tool</option>
                  <option value="Full Access">Full Access to All Tools</option>
                  <option value="Enterprise">Enterprise-Level Access</option>
                  <option value="Not Sure">Not Sure Yet</option>
                </select>
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label htmlFor="notes" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Additional Comments or Specific Needs</label>
                <textarea 
                  id="notes"
                  style={{ ...fieldStyle, height: "100px", resize: "none" }} 
                  placeholder="Tell us a bit more about what you're looking for..."
                  onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                />
              </div>

              <div style={{ gridColumn: "span 2", marginTop: "20px" }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  aria-busy={loading}
                  style={{ 
                    width: "100%", padding: "15px", background: "#860aa5", color: "white", 
                    border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", 
                    cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(134, 10, 165, 0.2)"
                  }}
                >
                  {loading ? "Registering Interest..." : "Join Priority Waitlist"}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate("/")} 
                  aria-label="Return to the main tools page"
                  style={{ width: "100%", background: "none", border: "none", color: "#718096", marginTop: "15px", cursor: "pointer", textDecoration: "underline" }}
                >
                  Return to Tools
                </button>
              </div>
            </form>
          </section>

          {/* RIGHT COLUMN: The Why AI Text */}
          <aside style={{ // Changed to <aside> for SEO
            flex: "1 1 350px", 
            maxWidth: "500px",
            padding: "35px", 
            paddingTop: "0px",
            backgroundColor: "#ffffff", 
            borderRadius: "15px", 
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
            color: "#2d3748",
            marginTop: "163px", 
          }}>
            <h3 style={sectionHeaderStyle}>Sign up for Micro SaaS Access</h3>
            <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
              <strong>What is an AI Micro SaaS?</strong> It is a small, focused software tool built to solve one specific problem. Think of it as a tiny but powerful product that makes your business run a little smoother.
            </p>

            <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "10px", marginBottom: "25px" }}>
              <p><strong>What is a SaaS?</strong> It stands for Software as a Service. Instead of installing software, you access it through the internet.</p>
              <p><strong>And AI?</strong> It means the tool is powered by Artificial Intelligence, helping it work smarter and faster for you.</p>
            </div>

            <h3 style={sectionHeaderStyle}>Where AI Actually Helps</h3>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "25px" }}>
              <li style={listItemStyle}>✨ <strong>Content writing:</strong> Emails and social posts</li>
              <li style={listItemStyle}>💬 <strong>Customer service:</strong> Smart chat tools</li>
              <li style={listItemStyle}>📊 <strong>Decision-making:</strong> Data-driven insights</li>
              <li style={listItemStyle}>🚀 <strong>Marketing:</strong> Automated campaigns</li>
            </ul>

            <h3 style={sectionHeaderStyle}>Why Get In Early?</h3>
            <p style={{ lineHeight: "1.6" }}>
              Half of all small businesses plan to adopt AI in the next year. Getting early access means you're ahead of them—not playing catch-up.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}