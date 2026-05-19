import { Link, useLocation } from "react-router-dom";
import { auth } from "./firebase";

export default function Layout({ children }) {
  const location = useLocation();
  const user = auth.currentUser;

  const isAuthPage = location.pathname === "/auth";
  const isUpgradePage = location.pathname === "/upgrade";
  const isDashboard = location.pathname === "/dashboard";
  const isProfilePage = location.pathname === "/settings/profile";

  const showLoginButton = !user && location.pathname === "/";

  return (
    <div style={{ width: "100%" }}>
      <header
        style={{
          width: "100%",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >

        {/* RIGHT SIDE BUTTONS */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", paddingRight: "50px" }}>

          {showLoginButton && (
            <Link
              to="/auth?mode=login"
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                background: "#f5f0ff",
                color: "#8a2be2",
                fontWeight: "600",
                textDecoration: "none",
                fontSize: "14px",
                border: "1px solid #e5d9ff",
              }}
            >
              Log in
            </Link>
          )}

          {!isDashboard && !isProfilePage && !user ? (
            <Link
              to={(isAuthPage || isUpgradePage) ? "/" : "/auth?redirect=/upgrade"}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                background: "#8a2be2",
                color: "white",
                fontWeight: "600",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              {(isAuthPage || isUpgradePage) ? "Back Home" : "Sign up for Pro"}
            </Link>
          ) : (!isProfilePage && (isAuthPage || isUpgradePage)) ? (
            <Link
              to="/"
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                background: "#8a2be2",
                color: "white",
                fontWeight: "600",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Back Home
            </Link>
          ) : null}
        </div>
      </header>

      <main style={{ paddingTop: "20px" }}>{children}</main>
    </div>
  );
}
