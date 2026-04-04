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
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  // ✅ Validate email format
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // ✅ Password strength checker
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Too short", color: "bg-red-400", width: "w-1/4" };
    if (pwd.length < 8 || !/[A-Z]/.test(pwd)) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
    if (!/[0-9]/.test(pwd) || !/[^a-zA-Z0-9]/.test(pwd)) return { label: "Medium", color: "bg-yellow-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
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

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setSuccess("Login successful! Redirecting...");
    setTimeout(() => onLogin && onLogin(user), 1200);
  };

  // ✅ Handle Register
  const handleRegister = () => {
    setError("");
    if (!name || !email || !password || !confirmPassword)
      return setError("Please fill in all fields.");
    if (!isValidEmail(email)) return setError("Invalid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === email))
      return setError("An account with this email already exists.");

    const newUser = { name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setSuccess("Account created! You can now log in.");
    setTimeout(() => {
      setIsLogin(true);
      setSuccess("");
      setName("");
      setPassword("");
      setConfirmPassword("");
    }, 1500);
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
    setTimeout(() => {
      setForgotMode(false);
      setSuccess("");
    }, 2500);
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
    setIsLogin(!isLogin);
    setForgotMode(false);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-green-500 to-indigo-400 min-h-screen flex justify-center items-center p-6">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🛍️</div>
          <h1 className="text-3xl font-bold text-gray-800">
            {forgotMode ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {forgotMode
              ? "We'll help you get back in"
              : isLogin
              ? "Sign in to your shop dashboard"
              : "Start generating AI marketing images"}
          </p>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3 mb-4">
            ✅ {success}
          </div>
        )}

        <div className="space-y-5">

          {/* Full Name — register only */}
          {!isLogin && !forgotMode && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Bhavya Shah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Password */}
          {!forgotMode && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer text-sm"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Strength Bar — register only */}
              {!isLogin && strength && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    strength.label === "Strong" ? "text-green-600" :
                    strength.label === "Medium" ? "text-yellow-600" : "text-red-500"
                  }`}>
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirm Password — register only */}
          {!isLogin && !forgotMode && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer text-sm"
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {/* Match indicator */}
              {confirmPassword && (
                <p className={`text-xs mt-1 font-medium ${
                  password === confirmPassword ? "text-green-600" : "text-red-500"
                }`}>
                  {password === confirmPassword ? "✅ Passwords match" : "❌ Passwords do not match"}
                </p>
              )}
            </div>
          )}

          {/* Remember Me + Forgot — login only */}
          {isLogin && !forgotMode && (
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-indigo-500"
                />
                Remember me
              </label>
              <button
                onClick={() => { setForgotMode(true); setError(""); setSuccess(""); }}
                className="text-indigo-500 hover:underline cursor-pointer font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-green-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition cursor-pointer disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : forgotMode
              ? "Send Reset Link"
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

          {/* Back from Forgot Mode */}
          {forgotMode && (
            <button
              onClick={() => { setForgotMode(false); setError(""); setSuccess(""); }}
              className="w-full text-gray-500 hover:text-gray-700 text-sm cursor-pointer transition"
            >
              ← Back to Sign In
            </button>
          )}

        </div>

        {/* Toggle Login / Register */}
        {!forgotMode && (
          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={switchMode}
              className="text-indigo-500 font-semibold hover:underline cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        )}

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Powered by Bhavya
        </p>

      </div>
    </div>
  );
}

export default Login;
