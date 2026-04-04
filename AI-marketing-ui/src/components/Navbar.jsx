
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <div className="bg-white shadow-md flex justify-between px-8 py-4">

//       <h1 className="font-bold text-indigo-600 text-lg">
//           AI Marketing Tool
//       </h1>

//       <div className="flex gap-6">
//         <Link to="/" className="hover:text-indigo-600">
//           Generate Ad
//         </Link>

//         <Link to="/settings" className="hover:text-indigo-600">
//           Shop Settings
//         </Link>

//         <Link to="/history" className="hover:text-indigo-600">
//           Image History
//         </Link>
//       </div>

//     </div>
//   );
// }

// export default Navbar;

///////////////////////////////////////////////////////////

import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <div className="bg-white shadow-md flex justify-between items-center px-8 py-4">

      <h1 className="font-bold text-indigo-600 text-lg">
        AI Marketing Tool
      </h1>

      <div className="flex gap-6 items-center">
        <Link to="/ai-image" className="hover:text-indigo-600">
          Generate Ad
        </Link>

        <Link to="/settings" className="hover:text-indigo-600">
          Shop Settings
        </Link>

        <Link to="/history" className="hover:text-indigo-600">
          Image History
        </Link>

        {/* ✅ Divider */}
        <div className="w-px h-5 bg-gray-300" />

        {/* ✅ User greeting */}
        {user?.name && (
          <span className="text-sm text-gray-500">
            👋 {user.name}
          </span>
        )}

        {/* ✅ Logout button */}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;
