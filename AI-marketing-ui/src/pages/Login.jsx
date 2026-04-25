import React, { useState, useEffect } from "react";

function Login({ onLogin }) {

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  // ✅ Auto-fill remembered email on load
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) { setEmail(remembered); setRememberMe(true); }
  }, []);

  // ✅ Validate email format
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // ✅ Password strength checker
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Too short", color: "#EF4444", pct: "25%" };
    if (pwd.length < 8 || !/[A-Z]/.test(pwd)) return { label: "Weak", color: "#F97316", pct: "50%" };
    if (!/[0-9]/.test(pwd) || !/[^a-zA-Z0-9]/.test(pwd)) return { label: "Medium", color: "#EAB308", pct: "75%" };
    return { label: "Strong", color: "#10B981", pct: "100%" };
  };
  const strength = !isLogin ? getPasswordStrength(password) : null;

  // ✅ Handle Login
  const handleLogin = () => {
    setError("");
    if (!email || !password) return setError("Please fill in all fields.");
    if (!isValidEmail(email)) return setError("Invalid email address.");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return setError("Incorrect email or password.");
    if (rememberMe) { localStorage.setItem("rememberedEmail", email); }
    else { localStorage.removeItem("rememberedEmail"); }
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setSuccess("Login successful! Redirecting...");
    setTimeout(() => onLogin && onLogin(user), 1200);
  };

  // ✅ Handle Register
  const handleRegister = () => {
    setError("");
    if (!name || !email || !password || !confirmPassword) return setError("Please fill in all fields.");
    if (!isValidEmail(email)) return setError("Invalid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === email)) return setError("An account with this email already exists.");
    const newUser = { name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setSuccess("Account created! You can now log in.");
    setTimeout(() => { setIsLogin(true); setSuccess(""); setName(""); setPassword(""); setConfirmPassword(""); }, 1500);
  };

  // ✅ Forgot Password (mock reset)
  const handleForgotPassword = () => {
    setError("");
    if (!email) return setError("Enter your email to reset password.");
    if (!isValidEmail(email)) return setError("Invalid email address.");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);
    if (!user) return setError("No account found with this email.");
    setSuccess(`A reset link would be sent to ${email}. (Demo mode)`);
    setTimeout(() => { setForgotMode(false); setSuccess(""); }, 2500);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      if (forgotMode) handleForgotPassword();
      else if (isLogin) handleLogin();
      else handleRegister();
      setLoading(false);
    }, 600);
  };

  const switchMode = () => {
    setIsLogin(!isLogin); setForgotMode(false);
    setError(""); setSuccess(""); setPassword(""); setConfirmPassword("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Left decorative panel ── */}
      <div style={{
        display: "none", // hidden on small; shown via inline overrides below
        width: "44%",
        background: "linear-gradient(145deg, var(--indigo) 0%, #7C3AED 60%, #4F46E5 100%)",
        padding: "3rem",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }} className="login-panel">
        {/* decorative circles */}
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
          top: "-100px", right: "-100px",
        }} />
        <div style={{
          position: "absolute", width: "280px", height: "280px",
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
          bottom: "-80px", left: "-80px",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", marginBottom: "2rem",
          }}>✦</div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "2rem",
            fontWeight: 800, color: "white", margin: "0 0 1rem",
          }}>
            AI Marketing Tool
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 2.5rem" }}>
            Generate stunning marketing images and captions for your shop — powered by AI.
          </p>
          {[
            "AI-generated ad images in seconds",
            "Marketing captions included",
            "Save and download your creations",
          ].map((feat) => (
            <div key={feat} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", color: "white", flexShrink: 0,
              }}>✓</div>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: form ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          animation: "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
        }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "linear-gradient(135deg, var(--indigo), #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", margin: "0 auto 14px",
              boxShadow: "0 6px 20px rgba(79,70,229,0.3)",
            }}>🛍️</div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "1.65rem",
              fontWeight: 800, margin: "0 0 5px", color: "var(--text-primary)",
            }}>
              {forgotMode ? "Reset Password" : isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
              {forgotMode ? "Enter your email to get a reset link"
                : isLogin ? "Sign in to your shop dashboard"
                : "Start generating AI marketing images"}
            </p>
          </div>

          {/* Card */}
          <div className="card-xl" style={{ padding: "32px" }}>

            {/* Error */}
            {error && (
              <div style={{
                background: "var(--rose-light)", border: "1px solid #FECDD3",
                borderRadius: "10px", padding: "11px 14px",
                marginBottom: "18px", display: "flex", gap: "8px", alignItems: "flex-start",
                animation: "slideUp 0.25s ease",
              }}>
                <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
                <span style={{ color: "#BE123C", fontSize: "0.85rem", fontWeight: 500 }}>{error}</span>
              </div>
            )}
            {/* Success */}
            {success && (
              <div style={{
                background: "var(--emerald-light)", border: "1px solid #A7F3D0",
                borderRadius: "10px", padding: "11px 14px",
                marginBottom: "18px", display: "flex", gap: "8px", alignItems: "flex-start",
                animation: "slideUp 0.25s ease",
              }}>
                <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>✅</span>
                <span style={{ color: "#065F46", fontSize: "0.85rem", fontWeight: 500 }}>{success}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Full Name */}
              {!isLogin && !forgotMode && (
                <div>
                  <label className="field-label">Full Name</label>
                  <input type="text" placeholder="Bhavya Shah"
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="input-field" />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="field-label">Email Address</label>
                <input type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field" />
              </div>

              {/* Password */}
              {!forgotMode && (
                <div>
                  <label className="field-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="input-field" style={{ paddingRight: "42px" }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "15px", color: "var(--text-faint)", padding: 0, lineHeight: 1,
                      }}>
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {/* Strength */}
                  {!isLogin && strength && (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ height: "4px", background: "var(--bg-alt)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "999px",
                          width: strength.pct, background: strength.color,
                          transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s",
                        }} />
                      </div>
                      <p style={{ fontSize: "0.75rem", marginTop: "4px", fontWeight: 600, color: strength.color }}>
                        Password strength: {strength.label}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password */}
              {!isLogin && !forgotMode && (
                <div>
                  <label className="field-label">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field" style={{ paddingRight: "42px" }}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "15px", color: "var(--text-faint)", padding: 0, lineHeight: 1,
                      }}>
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p style={{
                      fontSize: "0.75rem", marginTop: "4px", fontWeight: 600,
                      color: password === confirmPassword ? "#10B981" : "#EF4444",
                    }}>
                      {password === confirmPassword ? "✅ Passwords match" : "❌ Passwords do not match"}
                    </p>
                  )}
                </div>
              )}

              {/* Remember + Forgot */}
              {isLogin && !forgotMode && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <input type="checkbox" checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: "var(--indigo)", width: "14px", height: "14px" }} />
                    Remember me
                  </label>
                  <button onClick={() => { setForgotMode(true); setError(""); setSuccess(""); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--indigo)", fontSize: "0.85rem", fontWeight: 600, padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button onClick={handleSubmit} disabled={loading} className="btn-primary"
                style={{ width: "100%", padding: "13px", fontSize: "0.95rem", marginTop: "4px", borderRadius: "10px" }}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                      <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
                    </span>
                  : forgotMode ? "Send Reset Link"
                  : isLogin ? "Sign In"
                  : "Create Account"}
              </button>

              {/* Back from forgot */}
              {forgotMode && (
                <button onClick={() => { setForgotMode(false); setError(""); setSuccess(""); }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.875rem", width: "100%", textAlign: "center", padding: "4px" }}>
                  ← Back to Sign In
                </button>
              )}
            </div>
          </div>

          {/* Toggle */}
          {!forgotMode && (
            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "20px" }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={switchMode}
                style={{ background: "none", border: "none", color: "var(--indigo)", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem", padding: 0 }}>
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}

          <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: "0.75rem", marginTop: "16px" }}>
            Powered by Bhavya
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
