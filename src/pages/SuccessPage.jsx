import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 10);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Processing your upgrade…</h2>
      <p>You’ll be redirected shortly.</p>
    </div>
  );
}

