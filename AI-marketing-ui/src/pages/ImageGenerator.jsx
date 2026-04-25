import React, { useState, useEffect } from "react";

function ImageGenerator() {

  const [product, setProduct] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState("");

  const saved = JSON.parse(localStorage.getItem("shopSettings")) || {};
  const shopName    = saved.shopName    || "";
  const shopType    = saved.shopType    || "";
  const address     = saved.address     || "";
  const description = saved.description || "";
  const shopLogo    = saved.logo        || "";

  // ✅ This is the only new code added
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    if (history.length > 0) {
      const last = history[0];
      setImageUrl(last.image);
      setCaption(last.caption);
    }
  }, []);

  // Get logged in user
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const historyKey = `imageHistory_${user.email}`;

  const saveToHistory = (fullUrl, caption) => {
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    history.unshift({ image: fullUrl, caption, product, date: new Date().toISOString() });
    localStorage.setItem(historyKey, JSON.stringify(history));
  };

  // const saveToHistory = (fullUrl, caption) => {
  //   const history = JSON.parse(localStorage.getItem("imageHistory")) || [];
  //   history.unshift({ image: fullUrl, caption, product, date: new Date().toISOString() });
  //   localStorage.setItem("imageHistory", JSON.stringify(history));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setImageUrl(null); setCaption(""); setGeneratedProduct(product);
      const formData = new FormData();
      formData.append("product",     product);
      formData.append("shop_name",   shopName);
      formData.append("shop_type",   shopType);
      formData.append("address",     address);
      formData.append("description", description);
      formData.append("shop_logo",   shopLogo || ""); // ✅ Include shop logo in form data

      const response = await fetch("http://localhost:5000/", { method: "POST", body: formData });
      const data = await response.json();

      if (data.image_url) {
        const fullUrl = `http://localhost:5000/${data.image_url}`;
        setImageUrl(fullUrl);
        saveToHistory(fullUrl, data.caption); // ✅ Save full URL to history
      }
      if (data.caption) { setCaption(data.caption); }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while generating the image.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = product.replace(/\s+/g, "-").toLowerCase();
    link.download = `${fileName}-ad.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  const shopFields = [
    { label: "Shop Name",    value: shopName,    icon: "🏪" },
    { label: "Shop Type",    value: shopType,    icon: "🏷️" },
    { label: "Address",      value: address,     icon: "📍" },
    { label: "Description",  value: description, icon: "📝" },
    { label: "Shop Logo",    value: shopLogo
        ? <img src={saved.logo} alt="Shop Logo" style={{ height: "44px", objectFit: "contain", borderRadius: "6px" }} />
        : null,
      icon: "🖼"
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="page-wrap">

        {/* ── Page header ── */}
        <div style={{ marginBottom: "2rem" }} className="anim-up">
          <span className="badge badge-indigo" style={{ marginBottom: "10px" }}>✦ AI Powered</span>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "1.85rem",
            fontWeight: 800, margin: "0 0 6px", color: "var(--text-primary)",
          }}>
            Generate Marketing Ad
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Enter your product name — AI handles the rest.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}>

            {/* ── Left: Input panel ── */}
            <div className="card anim-up" style={{ padding: "28px", animationDelay: "0.05s" }}>

              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "22px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: "var(--indigo-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px",
                }}>✦</div>
                <div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Product Details
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", margin: 0 }}>Fill in what you want to advertise</p>
                </div>
              </div>

              {/* Product input */}
              <div style={{ marginBottom: "24px" }}>
                <label className="field-label">Product Name <span style={{ color: "var(--rose)" }}>*</span></label>
                <input
                  type="text" placeholder="e.g. Chocolate Donut"
                  value={product} onChange={(e) => setProduct(e.target.value)}
                  required className="input-field"
                />
              </div>

              {/* Divider */}
              <div style={{
                height: "1px", background: "var(--border)",
                margin: "0 0 20px",
              }} />

              {/* Shop settings */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.82rem", fontWeight: 700, margin: 0, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Shop Profile
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>from settings</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {shopFields.map(({ label, value, icon }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px", flexShrink: 0, width: "20px", textAlign: "center" }}>{icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-faint)", marginBottom: "3px", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                        <div className="readonly-field" style={{ padding: "7px 12px", fontSize: "0.85rem", borderRadius: "8px" }}>
                          {value || <span style={{ fontStyle: "italic", color: "var(--text-faint)", fontSize: "0.8rem" }}>Not set in settings</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <button type="submit" disabled={loading} className="btn-primary"
                style={{ width: "100%", padding: "13px", fontSize: "0.95rem", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading
                  ? <><span className="loading-dot" style={{ color: "white" }} /><span className="loading-dot" style={{ color: "white" }} /><span className="loading-dot" style={{ color: "white" }} /><span style={{ marginLeft: "4px" }}>Generating...</span></>
                  : <>✦ Generate Ad Image</>}
              </button>
            </div>

            {/* ── Right: Output panel ── */}
            <div className="card anim-up" style={{ padding: "28px", minHeight: "380px", display: "flex", flexDirection: "column", animationDelay: "0.1s" }}>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: "var(--teal-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px",
                }}>🖼</div>
                <div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Generated Output
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", margin: 0 }}>Your AI-generated ad appears here</p>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px", height: "48px",
                    border: "3px solid var(--indigo-light)",
                    borderTop: "3px solid var(--indigo)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Crafting your ad...</p>
                </div>
              )}

              {/* Empty */}
              {!loading && !imageUrl && (
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "10px",
                  border: "2px dashed var(--border)", borderRadius: "12px",
                  padding: "40px 20px",
                }}>
                  <div style={{ fontSize: "2.5rem", opacity: 0.35 }}>🎨</div>
                  <p style={{ color: "var(--text-faint)", fontSize: "0.875rem", textAlign: "center", margin: 0 }}>
                    Your generated image<br />will appear here
                  </p>
                </div>
              )}

              {/* Result */}
              {!loading && imageUrl && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideUp 0.4s ease" }}>

                  {/* Image */}
                  <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}>
                    <img
                      src={imageUrl}
                      alt="Generated"
                      style={{ width: "100%", display: "block" }}
                      onError={(e) => { console.error("Image failed to load:", imageUrl); e.target.alt = "Image failed to load"; }}
                    />
                  </div>

                  {/* Download */}
                  <button type="button" onClick={downloadImage} className="btn-outline"
                    style={{ width: "100%", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    ↓ Download Image
                  </button>

                  {/* Caption */}
                  {caption && (
                    <div style={{
                      background: "var(--bg)", border: "1px solid var(--border)",
                      borderRadius: "12px", overflow: "hidden",
                    }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 14px",
                        background: "linear-gradient(90deg, var(--indigo-light), #F5F3FF)",
                        borderBottom: "1px solid var(--indigo-mid)",
                      }}>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "var(--indigo)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Marketing Caption
                        </span>
                        <button onClick={copyCaption} style={{
                          background: captionCopied ? "var(--emerald-light)" : "var(--indigo-light)",
                          border: `1px solid ${captionCopied ? "#A7F3D0" : "var(--indigo-mid)"}`,
                          color: captionCopied ? "var(--emerald)" : "var(--indigo)",
                          fontSize: "0.75rem", fontWeight: 700,
                          fontFamily: "'DM Sans', sans-serif",
                          padding: "4px 10px", borderRadius: "6px",
                          cursor: "pointer", transition: "all 0.2s",
                        }}>
                          {captionCopied ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                      <p style={{
                        color: "var(--text-body)", fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.875rem", lineHeight: 1.7,
                        padding: "14px", margin: 0, whiteSpace: "pre-line",
                      }}>
                        {caption}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: "0.75rem", marginTop: "2.5rem" }}>
          Powered by Bhavya
        </p>
      </div>
    </div>
  );
}

export default ImageGenerator;
