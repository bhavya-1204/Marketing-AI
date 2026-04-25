import React, { useState, useEffect } from "react";

function ShopSettings() {

  const [shopName,    setShopName]    = useState("");
  const [shopType,    setShopType]    = useState("");
  const [address,     setAddress]     = useState("");
  const [description, setDescription] = useState("");
  const [logo,        setLogo]        = useState(null);
  const [saved,       setSaved]       = useState(false);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("shopSettings"));
    if (s) {
      setShopName(s.shopName    || "");
      setShopType(s.shopType    || "");
      setAddress(s.address      || "");
      setDescription(s.description || "");
      setLogo(s.logo            || ""); //
    }
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => { setLogo(reader.result); };
    if (file) { reader.readAsDataURL(file); }
  };

  const saveSettings = () => {
    const data = { shopName, shopType, address, description, logo };
    localStorage.setItem("shopSettings", JSON.stringify(data));
    setSaved(true);
    alert("Shop settings saved!");
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    { label: "Shop Name",   placeholder: "e.g. The V Cafe",               value: shopName,    set: setShopName,    icon: "🏪", hint: "Your business name shown in ads" },
    { label: "Shop Type",   placeholder: "e.g. Cafe / Bakery / Electronics", value: shopType, set: setShopType,    icon: "🏷️", hint: "Type of business you run" },
    { label: "Address",     placeholder: "e.g. Ahmedabad, Gujarat",        value: address,     set: setAddress,     icon: "📍", hint: "Where your shop is located" },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="page-wrap" style={{ maxWidth: "720px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "2rem" }} className="anim-up">
          <span className="badge badge-amber" style={{ marginBottom: "10px" }}>⚙ Configuration</span>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "1.85rem",
            fontWeight: 800, margin: "0 0 6px", color: "var(--text-primary)",
          }}>
            Shop Settings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
            These details appear in your AI-generated marketing ads.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* ── Basic info card ── */}
          <div className="card anim-up" style={{ padding: "28px", animationDelay: "0.05s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "22px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "var(--amber-light)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
              }}>🏪</div>
              <div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Business Information
                </h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", margin: 0 }}>Basic details about your shop</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {fields.map(({ label, placeholder, value, set, icon, hint }) => (
                <div key={label}>
                  <label className="field-label">
                    <span style={{ marginRight: "5px" }}>{icon}</span>{label}
                  </label>
                  <input
                    type="text" placeholder={placeholder}
                    value={value} onChange={(e) => set(e.target.value)}
                    className="input-field"
                  />
                  {hint && <p style={{ fontSize: "0.75rem", color: "var(--text-faint)", marginTop: "4px", marginBottom: 0 }}>{hint}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Description card ── */}
          <div className="card anim-up" style={{ padding: "28px", animationDelay: "0.1s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "var(--indigo-light)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
              }}>📝</div>
              <div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Business Description
                </h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", margin: 0 }}>Tell AI about your business for better ads</p>
              </div>
            </div>
            <textarea
              rows="4"
              placeholder="Describe your business, what makes it special, your target audience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              style={{ resize: "vertical", lineHeight: 1.65 }}
            />
          </div>

          {/* ── Logo card ── */}
          <div className="card anim-up" style={{ padding: "28px", animationDelay: "0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "var(--teal-light)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
              }}>🖼</div>
              <div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Shop Logo
                </h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", margin: 0 }}>Your logo will be included in generated ads</p>
              </div>
            </div>

            {/* Upload area */}
            <div style={{
              border: "2px dashed var(--border)", borderRadius: "12px",
              padding: "20px", background: "var(--bg)",
              transition: "border-color 0.18s",
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{
                  display: "block",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                  color: "var(--text-muted)", cursor: "pointer",
                  marginBottom: logo ? "16px" : 0,
                }}
              />

              {logo && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "12px 14px",
                  background: "var(--emerald-light)", border: "1px solid #A7F3D0",
                  borderRadius: "10px", animation: "fadeIn 0.3s ease",
                }}>
                  <img
                    src={logo} alt="logo preview"
                    style={{
                      width: "56px", height: "56px",
                      objectFit: "contain", borderRadius: "8px",
                      background: "white", border: "1px solid var(--border)",
                      padding: "4px",
                    }}
                  />
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "var(--emerald)", margin: "0 0 2px" }}>
                      ✓ Logo uploaded
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--teal)", margin: 0 }}>
                      This will be used in your AI ads
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Save button ── */}
          <div className="anim-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={saveSettings}
              className="btn-primary"
              style={{
                width: "100%", padding: "14px",
                fontSize: "0.95rem", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              }}
            >
              {saved ? "✓ Saved!" : "Save Shop Settings"}
            </button>
            <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: "0.78rem", marginTop: "8px" }}>
              Settings are saved locally and used when generating ads
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: "0.75rem", marginTop: "2.5rem" }}>
          Powered by Bhavya
        </p>
      </div>
    </div>
  );
}

export default ShopSettings;
