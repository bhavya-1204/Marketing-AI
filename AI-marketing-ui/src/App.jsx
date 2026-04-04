// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ImageGenerator from "./pages/ImageGenerator";
// import ShopSettings from "./pages/ShopSettings";
// import Navbar from "./components/Navbar";
// import ImageHistory from "./pages/ImageHistory";

// function App() {
//   return (
//     <Router>

//       <Navbar />

//       <Routes>
//         <Route path="/" element={<ImageGenerator />} />
//         <Route path="/settings" element={<ShopSettings />} />
//         <Route path="/history" element={<ImageHistory />} />
//       </Routes>

//     </Router>
//   );
// }

// export default App;

//////////////////////////////////////////////////////////

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ImageGenerator from "./pages/ImageGenerator";
import ShopSettings from "./pages/ShopSettings";
import Navbar from "./components/Navbar";
import ImageHistory from "./pages/ImageHistory";
import Login from "./pages/Login";

function App() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  // ✅ If not logged in, show Login page only
  if (!user) {
    return <Login onLogin={(loggedInUser) => setUser(loggedInUser)} />;
  }

  // ✅ Logged in — show full app
  return (
    <Router>

      <Navbar user={user} onLogout={() => {
        localStorage.removeItem("loggedInUser");
        setUser(null);
      }} />

      <Routes>
        {/* ✅ Redirect root to /ai-image after login */}
        <Route path="/" element={<Navigate to="/ai-image" replace />} />
        <Route path="/ai-image" element={<ImageGenerator />} />
        <Route path="/settings" element={<ShopSettings />} />
        <Route path="/history" element={<ImageHistory />} />
      </Routes>

    </Router>
  );
}

export default App;
