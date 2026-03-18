// import React, { useState } from "react";

// function ImageGenerator() {

//   const [product, setProduct] = useState("");
//   // const [shopName, setShopName] = useState("");
//   // const [shopType, setShopType] = useState("");
//   // const [address, setAddress] = useState("");
//   // const [description, setDescription] = useState("");

//   const [imageUrl, setImageUrl] = useState(null);
//   // const [imageUrl, setImageUrl] = useState('/generated_image1.png');
//   const [caption, setCaption] = useState("");
//   const [loading, setLoading] = useState(false);

//   const saved = JSON.parse(localStorage.getItem("shopSettings"));

//   const shopName = saved?.shopName || "";
//   const shopType = saved?.shopType || "";
//   const address = saved?.address || "";
//   const description = saved?.description || "";

//   const saveToHistory = (image, caption) => {

//     const history = JSON.parse(localStorage.getItem("imageHistory")) || [];

//     history.unshift({
//       image,
//       caption,
//       date: new Date().toISOString()
//     });

//     localStorage.setItem("imageHistory", JSON.stringify(history));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       setImageUrl(null);
//       setCaption("");

//       const formData = new FormData();
//       formData.append("product", product);
//       formData.append("shop_name", shopName);
//       formData.append("shop_type", shopType);
//       formData.append("address", address);
//       formData.append("description", description);

//       const response = await fetch("http://localhost:5000/", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.image_url) {
//         setImageUrl(`http://localhost:5000/${data.image_url}`);
//         // setImageUrl(data.image_url);
//       }

//       if (data.caption) {
//         setCaption(data.caption);
//       }

//       saveToHistory(data.image_url, data.caption);

//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong while generating the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadImage = async () => {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();

//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;

//     // create file name using product
//     const fileName = product.replace(/\s+/g, "-").toLowerCase();

//     link.download = `${fileName}-ad.png`;

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const copyCaption = () => {
//     navigator.clipboard.writeText(caption);
//     // alert("Caption copied!");
//   };

//   return (
//     <div className="bg-gradient-to-br from-blue-600 via-green-500 to-indigo-400 min-h-screen flex items-center justify-center w-full p-5">

//       {/* Navbar */}
//       {/* <div className="absolute top-5 left-5 text-white font-bold text-lg">
//         AI Marketing Image Generator
//       </div> */}

//       <div className="bg-green-50 shadow-2xl rounded-2xl w-full p-8 m-10">

//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           AI Marketing Prompt Generator
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-5">

//           <div className="flex flex-col gap-4 max-w-3xl mx-auto">

//             {/* Product */}
//             <div className="flex items-center gap-4">
//               <label className="w-56 text-gray-700 text-2xl">Product</label>
//               <input
//                 type="text"
//                 placeholder="Chocolate Donut"
//                 value={product}
//                 onChange={(e) => setProduct(e.target.value)}
//                 required
//                 className="w-full max-w-2xl border border-gray-300 rounded-lg px-4 py-2"
//               />
//             </div>

//             {/* Shop Name */}
//             <div className="flex items-center gap-4">
//               <label className="w-56 text-gray-700 text-2xl">Shop Name</label>
//               <input
//                 type="text"
//                 placeholder="The V Cafe"
//                 value={shopName}
//                 onChange={(e) => setShopName(e.target.value)}
//                 required
//                 className="w-full max-w-2xl border border-gray-300 rounded-lg px-4 py-2"
//               />
//             </div>

//             {/* Shop Type */}
//             <div className="flex items-center gap-4">
//               <label className="w-56 text-gray-700 text-2xl">Shop Type</label>
//               <input
//                 type="text"
//                 placeholder="Cafe / Bakery / Electronics"
//                 value={shopType}
//                 onChange={(e) => setShopType(e.target.value)}
//                 required
//                 className="w-full max-w-2xl border border-gray-300 rounded-lg px-4 py-2"
//               />
//             </div>

//             {/* Address */}
//             <div className="flex items-center gap-4">
//               <label className="w-56 text-gray-700 text-2xl">Address</label>
//               <input
//                 type="text"
//                 placeholder="Location of your shop"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 required
//                 className="w-full max-w-2xl border border-gray-300 rounded-lg px-4 py-2"
//               />
//             </div>

//             {/* Description */}
//             <div className="flex items-start gap-4">
//               <label className="w-56 text-gray-700 text-2xl">
//                 Business Description
//               </label>
//               <textarea
//                 rows="3"
//                 placeholder="Describe your business..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//                 className="w-full max-w-2xl border border-gray-300 rounded-lg px-4 py-2"
//               />
//             </div>

//           </div>

//           {/* Generate Button */}
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-44 bg-gradient-to-r from-indigo-500 to-green-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50 cursor-pointer"
//             >
//               {loading ? "Generating..." : "Generate Image"}
//             </button>
//           </div>

//         </form>

//         {/* Result Section */}
//         {imageUrl && (
//           <div className="flex flex-col md:flex-row gap-6 mt-6 p-6 justify-center items-start">

//             <div className="flex flex-col items-center gap-3">
//               <img
//                 src={imageUrl}
//                 className="rounded-xl shadow-lg w-96 object-cover"
//                 alt="Generated"
//               />

//               <a
//                 onClick={downloadImage}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer"
//               >
//                 Download Image
//               </a>
//             </div>

//             {caption && (
//               <div className="border border-gray-200 rounded-xl flex-1 max-w-xl max-h-38">

//                 <div className="border-b bg-green-300 rounded-t-xl p-3 flex justify-between">
//                   <h3 className="font-semibold">Marketing Caption</h3>

//                   <button
//                     onClick={copyCaption}
//                     className="font-bold hover:text-blue-700 cursor-pointer"
//                   >
//                     Copy
//                   </button>
//                 </div>

//                 <p className="text-black whitespace-pre-line p-4">
//                   {caption}
//                 </p>

//               </div>
//             )}

//           </div>
//         )}

//         <div className="text-center text-gray-400 text-sm mt-6">
//           Powered by Bhavya
//         </div>

//       </div>

//     </div>
//   );
// }

// export default ImageGenerator;


////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";

function ImageGenerator() {

  const [product, setProduct] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const saved = JSON.parse(localStorage.getItem("shopSettings")) || {};
  const shopName = saved.shopName || "";
  const shopType = saved.shopType || "";
  const address = saved.address || "";
  const description = saved.description || "";
  const shopLogo = saved.logo || "";

  // ✅ This is the only new code added
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("imageHistory")) || [];
    if (history.length > 0) {
      const last = history[0];
      setImageUrl(last.image);
      setCaption(last.caption);
    }
  }, []);

  const saveToHistory = (fullUrl, caption) => {
    const history = JSON.parse(localStorage.getItem("imageHistory")) || [];
    history.unshift({
      image: fullUrl,   // ✅ Save full URL
      caption,
      product,
      date: new Date().toISOString()
    });
    localStorage.setItem("imageHistory", JSON.stringify(history));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setImageUrl(null);
      setCaption("");

      const formData = new FormData();
      formData.append("product", product);
      formData.append("shop_name", shopName);
      formData.append("shop_type", shopType);
      formData.append("address", address);
      formData.append("description", description);
      formData.append("shop_logo", shopLogo || ""); // ✅ Include shop logo in form data

      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        body: formData,
      });

      // const response = await fetch(`${process.env.REACT_APP_API_URL}/`, {
      //   method: "POST",
      //   body: formData,
      // });

      const data = await response.json();

      if (data.image_url) {
        const fullUrl = `http://localhost:5000/${data.image_url}`;
        setImageUrl(fullUrl);
        saveToHistory(fullUrl, data.caption); // ✅ Save full URL to history
      }

      // if (data.image_url) {
      //   const fullUrl = `${process.env.REACT_APP_API_URL}/${data.image_url}`;
      //   setImageUrl(fullUrl);
      //   saveToHistory(fullUrl, data.caption); // ✅ Save full URL to history
      // }

      if (data.caption) {
        setCaption(data.caption);
      }

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

    // create file name using product
    const fileName = product.replace(/\s+/g, "-").toLowerCase();

    link.download = `${fileName}-ad.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(caption);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-green-500 to-indigo-400 min-h-screen flex items-center justify-center w-full p-5">
      <div className="bg-green-50 shadow-2xl rounded-2xl w-full p-8 m-10">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          AI Marketing Prompt Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">

            {/* Product */}
            <div className="flex items-center gap-4">
              <label className="w-56 text-gray-700 text-2xl">Product</label>
              <input
                type="text"
                placeholder="Chocolate Donut"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
                className="w-full max-w-2xl border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Read-only shop settings */}
            {[
              { label: "Shop Name", value: shopName },
              { label: "Shop Type", value: shopType },
              { label: "Address", value: address },
              { label: "Description", value: description },
              { label: "Shop Logo", value: shopLogo ? <img src={saved.logo} alt="Shop Logo" className="h-16 object-contain" /> : null },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <label className="w-56 text-gray-700 text-2xl">{label}</label>
                <p className="w-full max-w-2xl border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 text-gray-600">
                  {value || <span className="italic text-gray-400">Not set in settings</span>}
                </p>
              </div>
            ))}

          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-44 bg-gradient-to-r from-indigo-500 to-green-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </div>
        </form>

        {/* Result Section */}
        {imageUrl && (
          <div className="flex flex-col md:flex-row gap-6 mt-6 p-6 justify-center items-start">

            <div className="flex flex-col items-center gap-3">
              <img
                src={imageUrl}
                className="rounded-xl shadow-lg w-96 object-cover"
                alt="Generated"
                onError={(e) => {
                  console.error("Image failed to load:", imageUrl);
                  e.target.alt = "Image failed to load";
                }}
              />
              <button
                onClick={downloadImage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer"
              >
                Download Image
              </button>
            </div>

            {caption && (
              <div className="border border-gray-200 rounded-xl flex-1 max-w-xl">
                <div className="border-b bg-green-300 rounded-t-xl p-3 flex justify-between">
                  <h3 className="font-semibold">Marketing Caption</h3>
                  <button
                    onClick={copyCaption}
                    className="font-bold hover:text-blue-700 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-black whitespace-pre-line p-4">{caption}</p>
              </div>
            )}

          </div>
        )}

        <div className="text-center text-gray-400 text-sm mt-6">
          Powered by Bhavya
        </div>

      </div>
    </div>
  );
}

export default ImageGenerator;

///////////////////////////////////////////////////////////////////


// import React, { useState } from "react";

// function ImageGenerator() {

//   const [product, setProduct] = useState("");
//   const [imageUrl, setImageUrl] = useState(null);
//   const [caption, setCaption] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Read shop settings from localStorage (no setters needed here)
//   const saved = JSON.parse(localStorage.getItem("shopSettings")) || {};
//   const shopName = saved.shopName || "";
//   const shopType = saved.shopType || "";
//   const address = saved.address || "";
//   const description = saved.description || "";

//   const saveToHistory = (image, caption) => {
//     const history = JSON.parse(localStorage.getItem("imageHistory")) || [];
//     history.unshift({ image, caption, date: new Date().toISOString() });
//     localStorage.setItem("imageHistory", JSON.stringify(history));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setImageUrl(null);
//       setCaption("");

//       const formData = new FormData();
//       formData.append("product", product);
//       formData.append("shop_name", shopName);
//       formData.append("shop_type", shopType);
//       formData.append("address", address);
//       formData.append("description", description);

//       const response = await fetch("http://localhost:5000/", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.image_url) {
//         // ✅ Extract just the filename, ignore any folder prefix
//         const filename = data.image_url.split("/").pop();
//         setImageUrl(`http://localhost:5000/images/${filename}`);
//       }

//       if (data.caption) {
//         setCaption(data.caption);
//       }

//       saveToHistory(data.image_url, data.caption);

//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong while generating the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadImage = async () => {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     const fileName = product.replace(/\s+/g, "-").toLowerCase();
//     link.download = `${fileName}-ad.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const copyCaption = () => {
//     navigator.clipboard.writeText(caption);
//   };

//   return (
//     <div className="bg-gradient-to-br from-blue-600 via-green-500 to-indigo-400 min-h-screen flex items-center justify-center w-full p-5">
//       <div className="bg-green-50 shadow-2xl rounded-2xl w-full p-8 m-10">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           AI Marketing Prompt Generator
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="flex flex-col gap-4 max-w-3xl mx-auto">

//             {/* Product — only editable field now */}
//             <div className="flex items-center gap-4">
//               <label className="w-56 text-gray-700 text-2xl">Product</label>
//               <input
//                 type="text"
//                 placeholder="Chocolate Donut"
//                 value={product}
//                 onChange={(e) => setProduct(e.target.value)}
//                 required
//                 className="w-full max-w-2xl border border-gray-300 rounded-lg px-4 py-2"
//               />
//             </div>

//             {/* Read-only display of saved shop settings */}
//             {[
//               { label: "Shop Name", value: shopName },
//               { label: "Shop Type", value: shopType },
//               { label: "Address", value: address },
//               { label: "Description", value: description },
//             ].map(({ label, value }) => (
//               <div key={label} className="flex items-center gap-4">
//                 <label className="w-56 text-gray-700 text-2xl">{label}</label>
//                 <p className="w-full max-w-2xl border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 text-gray-600">
//                   {value || <span className="italic text-gray-400">Not set in settings</span>}
//                 </p>
//               </div>
//             ))}

//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-44 bg-gradient-to-r from-indigo-500 to-green-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50 cursor-pointer"
//             >
//               {loading ? "Generating..." : "Generate Image"}
//             </button>
//           </div>
//         </form>

//         {imageUrl && (
//           <div className="flex flex-col md:flex-row gap-6 mt-6 p-6 justify-center items-start">
//             <div className="flex flex-col items-center gap-3">
//               <img
//                 src={imageUrl}
//                 className="rounded-xl shadow-lg w-96 object-cover"
//                 alt="Generated"
//                 // ✅ Add error handler so you can see if the URL is wrong
//                 onError={(e) => {
//                   console.error("Image failed to load:", imageUrl);
//                   e.target.alt = "Image failed to load — check console";
//                 }}
//               />
//               <button
//                 onClick={downloadImage}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer"
//               >
//                 Download Image
//               </button>
//             </div>

//             {caption && (
//               <div className="border border-gray-200 rounded-xl flex-1 max-w-xl">
//                 <div className="border-b bg-green-300 rounded-t-xl p-3 flex justify-between">
//                   <h3 className="font-semibold">Marketing Caption</h3>
//                   <button onClick={copyCaption} className="font-bold hover:text-blue-700 cursor-pointer">
//                     Copy
//                   </button>
//                 </div>
//                 <p className="text-black whitespace-pre-line p-4">{caption}</p>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="text-center text-gray-400 text-sm mt-6">
//           Powered by Bhavya
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ImageGenerator;
