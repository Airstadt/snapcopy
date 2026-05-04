import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ padding: "40px" }}>
      <h1>{mode === "login" ? "Log In" : "Sign Up"}</h1>

      <div style={{ marginTop: "20px" }}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginTop: "8px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginTop: "8px" }}
        />
      </div>

      <button style={{ marginTop: "20px" }}>
        {mode === "login" ? "Log In" : "Sign Up"}
      </button>

      <button
        style={{ marginTop: "20px", display: "block" }}
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}
