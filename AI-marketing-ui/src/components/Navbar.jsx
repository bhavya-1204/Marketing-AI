
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-white shadow-md flex justify-between px-8 py-4">

      <h1 className="font-bold text-indigo-600 text-lg">
          AI Marketing Tool
      </h1>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-indigo-600">
          Generate Ad
        </Link>

        <Link to="/settings" className="hover:text-indigo-600">
          Shop Settings
        </Link>

        <Link to="/history" className="hover:text-indigo-600">
          Image History
        </Link>
      </div>

    </div>
  );
}

export default Navbar;
