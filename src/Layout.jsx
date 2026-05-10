export default function Layout({ children }) {
  return (
    <div>
      <header style={{
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #eee"
      }}>
        <img src="./public/snapcopy_logo.png" alt="SnapCopy" style={{ height: 40 }} />

        <a href="/" style={{ textDecoration: "none", color: "#8a2be2", fontWeight: "bold" }}>
          SnapCopy
        </a>
      </header>

      <main style={{ paddingTop: "20px" }}>
        {children}
      </main>
    </div>
  );
}
