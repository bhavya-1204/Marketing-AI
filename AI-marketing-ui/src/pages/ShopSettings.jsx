import React, { useState, useEffect } from "react";

function ShopSettings() {

  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shopSettings"));

    if (saved) {
      setShopName(saved.shopName || "");
      setShopType(saved.shopType || "");
      setAddress(saved.address || "");
      setDescription(saved.description || "");
      setLogo(saved.logo || ""); //
    }
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setLogo(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {

    const data = {
      shopName,
      shopType,
      address,
      description,
      logo
    };

    localStorage.setItem("shopSettings", JSON.stringify(data));

    alert("Shop settings saved!");
  };

  return (

    <div className="bg-gradient-to-br from-blue-600 via-green-500 to-indigo-400 min-h-screen flex justify-center items-center p-6">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Shop Settings
        </h2>

        <div className="space-y-6">

          {/* Shop Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Shop Name
            </label>
            <input
              type="text"
              placeholder="The V Cafe"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Shop Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Shop Type
            </label>
            <input
              type="text"
              placeholder="Cafe / Bakery / Electronics"
              value={shopType}
              onChange={(e) => setShopType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Address
            </label>
            <input
              type="text"
              placeholder="Ahmedabad, Gujarat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Business Description
            </label>
            <textarea
              rows="3"
              placeholder="Describe your business..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Logo Upload */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

            <label className="block font-semibold text-gray-700 mb-2">
              Shop Logo
            </label>

            <input
              type="file"
              //value={logo} //
              accept="image/*"
              onChange={handleLogoUpload}
              className="mb-3"
            />

            {logo && (
              <div className="flex items-center gap-4">

                <img
                  src={logo}
                  alt="logo preview"
                  className="w-20 h-20 object-contain border rounded-lg bg-white"
                />

                <p className="text-sm text-gray-500">
                  Logo preview
                </p>

              </div>
            )}

          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            className="w-full bg-gradient-to-r from-indigo-500 to-green-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Save Shop Settings
          </button>

        </div>

      </div>

    </div>
  );
}

export default ShopSettings;
