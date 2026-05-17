import { Link, useLocation } from "react-router-dom";
import { auth } from "./firebase"; 

export default function Layout({ children }) {
  const location = useLocation();
  const user = auth.currentUser;

  const isAuthPage = location.pathname === "/auth";
  const isUpgradePage = location.pathname === "/upgrade";
  const isDashboard = location.pathname === "/dashboard";

  // ⭐ Detect the Profile page
  const isProfilePage = location.pathname === "/settings/profile";

  return (
    <div style={{ width: "100%" }}>
      <header
       style={{
            width: "100%",
            padding: "28px 24px",   // ⭐ Increased vertical padding
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #eee",
            boxSizing: "border-box", // ⭐ Ensures padding behaves correctly
          }}
>
        <img
          src="/snapcopy_logo.png"
          alt="SnapCopy"
          style={{ height: 40 }}
        />


{/* ⭐ Login button for returning users on Home page */}
{!user && location.pathname === "/" && (
  <Link
    to="/auth?mode=login"
    style={{
      textDecoration: "none",
      color: "#8a2be2",
      fontWeight: "bold",
    }}
  >
    Log in
  </Link>
)}

        

        {/* Existing logic for other pages */}
        {!isDashboard && !isProfilePage && !user ? (
          <Link
            to={(isAuthPage || isUpgradePage) ? "/" : "/auth?redirect=/upgrade"}
            style={{
              textDecoration: "none",
              color: "#8a2be2",
              fontWeight: "bold",
            }}
          >
            {(isAuthPage || isUpgradePage) ? "Back Home" : "Sign up for pro"}
          </Link>
        ) : (!isProfilePage && (isAuthPage || isUpgradePage)) ? (
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#8a2be2",
              fontWeight: "bold",
            }}
          >
            Back Home
          </Link>
        ) : null}
      </header>

      <main style={{ paddingTop: "20px" }}>
        {children}
      </main>
    </div>
  );
}
