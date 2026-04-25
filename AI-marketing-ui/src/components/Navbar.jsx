import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const location = useLocation();

  const links = [
    { to: "/ai-image", label: "Generate Ad",    icon: "✦" },
    { to: "/settings", label: "Shop Settings",  icon: "⚙" },
    { to: "/history",  label: "Image History",  icon: "🗂" },
  ];

  return (
    <header style={{
      background: "var(--white)",
      borderBottom: "1px solid var(--border)",
      boxShadow: "0 1px 0 var(--border), var(--shadow-xs)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1140px", margin: "0 auto",
        padding: "0 2rem", height: "62px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "1rem",
      }}>

        {/* ── Brand ── */}
        <Link to="/ai-image" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "linear-gradient(135deg, var(--indigo), #7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", color: "white",
            boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
          }}>✦</div>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: "1.05rem", color: "var(--text-primary)",
          }}>
            AI Marketing<span style={{ color: "var(--indigo)" }}> Tool</span>
          </span>
        </Link>

        {/* ── Nav links ── */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── User area ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {/* divider */}
          <div style={{ width: "1px", height: "22px", background: "var(--border)" }} />

          {user?.name && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "5px 12px 5px 6px",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
            }}>
              {/* Avatar */}
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--indigo), #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "11px", fontWeight: 700,
                fontFamily: "'Outfit', sans-serif", flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
                fontWeight: 600, color: "var(--text-body)",
              }}>
                {user.name}
              </span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="btn-danger"
            style={{ fontSize: "0.8rem", padding: "7px 14px", borderRadius: "8px" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
