import React, { useEffect, useState } from "react";

function ImageHistory() {

  const [history, setHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null); // ✅ Track which caption was copied

  // Get logged in user
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const historyKey = `imageHistory_${user.email}`;

  const saveToHistory = (fullUrl, caption) => {
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    history.unshift({ image: fullUrl, caption, product, date: new Date().toISOString() });
    localStorage.setItem(historyKey, JSON.stringify(history));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(historyKey)) || [];
    setHistory(saved);
  }, []);

  // ✅ Delete single item
  const deleteItem = (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem(historyKey, JSON.stringify(updated));
  };

  // ✅ Delete all history
  const clearAll = () => {
    if (confirm("Are you sure you want to delete all history?")) {
      setHistory([]);
      localStorage.removeItem(historyKey);
    }
  };

  // ✅ Download image
  const downloadImage = async (imageUrl, product, index) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // ✅ Use product name if available, fallback to index
      const fileName = product
        ? product.replace(/\s+/g, "-").toLowerCase() + "-ad"
        : `generated-image-${index + 1}`;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image.");
    }
  };

  // ✅ Copy caption with feedback
  const copyCaption = (caption, index) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // reset after 2s
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="page-wrap">

        {/* ── Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: "2rem",
        }} className="anim-up">
          <div>
            <span className="badge badge-teal" style={{ marginBottom: "10px" }}>🗂 Archive</span>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "1.85rem",
              fontWeight: 800, margin: "0 0 4px", color: "var(--text-primary)",
            }}>
              Image History
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
              {history.length > 0
                ? `${history.length} image${history.length !== 1 ? "s" : ""} generated`
                : "No images yet"}
            </p>
          </div>

          {history.length > 0 && (
            <button onClick={clearAll} className="btn-danger">
              Clear All
            </button>
          )}
        </div>

        {/* ── Stats bar ── */}
        {history.length > 0 && (
          <div style={{
            display: "flex", gap: "12px", marginBottom: "1.75rem",
            animation: "slideUp 0.4s ease 0.05s both",
          }}>
            {[
              { label: "Total Generated", value: history.length, icon: "🖼" },
              { label: "Latest", value: history[0]?.product || "—", icon: "✦" },
              {
                label: "Last Generated",
                value: history[0] ? new Date(history[0].date).toLocaleDateString([], { month: "short", day: "numeric" }) : "—",
                icon: "📅"
              },
            ].map((stat) => (
              <div key={stat.label} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                <span style={{ fontSize: "18px" }}>{stat.icon}</span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {history.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
            animation: "fadeIn 0.4s ease",
          }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "18px",
              background: "var(--indigo-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem",
            }}>🖼</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-muted)", margin: 0 }}>
              No images yet
            </h3>
            <p style={{ color: "var(--text-faint)", fontSize: "0.875rem", margin: 0 }}>
              Head to Generate Ad to create your first AI marketing image
            </p>
          </div>
        ) : (
          /* ── Grid ── */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}>
            {history.map((item, index) => (
              <div
                key={index}
                className="history-card"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "var(--shadow-sm)",
                  animation: `slideUp 0.4s ease ${index * 0.05}s both`,
                }}
              >

                {/* Delete btn */}
                <button
                  onClick={() => deleteItem(index)}
                  style={{
                    position: "absolute", top: "10px", right: "10px",
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid var(--border)",
                    color: "var(--rose)", width: "28px", height: "28px",
                    borderRadius: "8px", fontSize: "11px", fontWeight: 700,
                    cursor: "pointer", zIndex: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.18s",
                    boxShadow: "var(--shadow-xs)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--rose-light)"; e.currentTarget.style.borderColor = "#FECDD3"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  ✕
                </button>

                {/* Image */}
                <div style={{ overflow: "hidden", background: "var(--bg-alt)" }}>
                  <img
                    src={item.image}
                    alt={`Generated ${index + 1}`}
                    style={{ width: "100%", display: "block", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>

                {/* Card body */}
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>

                  {/* Product + date */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    {item.product && (
                      <span style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", fontWeight: 700,
                        color: "var(--indigo)", background: "var(--indigo-light)",
                        border: "1px solid var(--indigo-mid)",
                        borderRadius: "999px", padding: "2px 10px",
                      }}>
                        {item.product}
                      </span>
                    )}
                    <span style={{ fontSize: "0.7rem", color: "var(--text-faint)", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {new Date(item.date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Download */}
                  <button
                    onClick={() => downloadImage(item.image, item.product, index)}
                    className="btn-outline"
                    style={{ width: "100%", padding: "8px", fontSize: "0.82rem" }}
                  >
                    ↓ Download Image
                  </button>

                  {/* Caption */}
                  {item.caption && (
                    <div style={{
                      background: "var(--bg)", border: "1px solid var(--border)",
                      borderRadius: "10px", overflow: "hidden",
                    }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 12px",
                        background: "linear-gradient(90deg, var(--indigo-light), #F5F3FF)",
                        borderBottom: "1px solid var(--indigo-mid)",
                      }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "var(--indigo)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Caption
                        </span>
                        <button
                          onClick={() => copyCaption(item.caption, index)}
                          style={{
                            background: copiedIndex === index ? "var(--emerald-light)" : "var(--white)",
                            border: `1px solid ${copiedIndex === index ? "#A7F3D0" : "var(--border)"}`,
                            color: copiedIndex === index ? "var(--emerald)" : "var(--text-muted)",
                            fontSize: "0.7rem", fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            padding: "3px 9px", borderRadius: "6px",
                            cursor: "pointer", transition: "all 0.18s",
                          }}
                        >
                          {copiedIndex === index ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                      <p style={{
                        color: "var(--text-body)", fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.82rem", lineHeight: 1.6,
                        padding: "10px 12px", margin: 0, whiteSpace: "pre-line",
                      }}>
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageHistory;
