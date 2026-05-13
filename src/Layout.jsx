import { Link, useLocation } from "react-router-dom";
import { auth } from "./firebase"; 

export default function Layout({ children }) {
  const location = useLocation();
  const user = auth.currentUser;
  
  // Define which pages should show the "Back Home" button
  const isAuthPage = location.pathname === "/auth";
  const isUpgradePage = location.pathname === "/upgrade";
  const isDashboard = location.pathname === "/dashboard";

  return (
  <div style={{ width: "100%" }}>
    <header
      style={{
        width: "100%",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #eee"
      }}>
        <img src="./public/snapcopy_logo.png" alt="SnapCopy" style={{ height: 40 }} />

        {/* Logic:
            1. If on Dashboard, show nothing (blank).
            2. If on Auth OR Upgrade screen, show "Back Home".
            3. If user is logged in (but not on the above), show nothing.
            4. Otherwise (Home page, etc), show "Sign up for pro".
        */}
        {!isDashboard && !user ? (
          <Link 
            to={(isAuthPage || isUpgradePage) ? "/" : "/auth?redirect=/upgrade"} 
            style={{ textDecoration: "none", color: "#8a2be2", fontWeight: "bold" }}
          >
            {(isAuthPage || isUpgradePage) ? "Back Home" : "Sign up for pro"}
          </Link>
        ) : (isAuthPage || isUpgradePage) ? (
          /* Case for logged-in users who navigate to these screens */
          <Link to="/" style={{ textDecoration: "none", color: "#8a2be2", fontWeight: "bold" }}>
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