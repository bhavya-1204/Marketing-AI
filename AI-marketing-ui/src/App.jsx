import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImageGenerator from "./pages/ImageGenerator";
import ShopSettings from "./pages/ShopSettings";
import Navbar from "./components/Navbar";
import ImageHistory from "./pages/ImageHistory";

function App() {
  return (
    <Router>

      <Navbar />

      <Routes>
        <Route path="/" element={<ImageGenerator />} />
        <Route path="/settings" element={<ShopSettings />} />
        <Route path="/history" element={<ImageHistory />} />
      </Routes>

    </Router>
  );
}

export default App;
