import React, { useEffect, useState } from "react";

function ImageHistory() {

  const [history, setHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null); // ✅ Track which caption was copied

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("imageHistory")) || [];
    setHistory(saved);
  }, []);

  // ✅ Delete single item
  const deleteItem = (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("imageHistory", JSON.stringify(updated));
  };

  // ✅ Delete all history
  const clearAll = () => {
    if (confirm("Are you sure you want to delete all history?")) {
      setHistory([]);
      localStorage.removeItem("imageHistory");
    }
  };

  // ✅ Download image
  const downloadImage = async (imageUrl, product, index) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // ✅ Use product name if available, fallback to index
      const fileName = product
        ? product.replace(/\s+/g, "-").toLowerCase() + "-ad"
        : `generated-image-${index + 1}`;

      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image.");
    }
  };

  // ✅ Copy caption with feedback
  const copyCaption = (caption, index) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // reset after 2s
  };

  return (
    <div className="p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generated Image History</h1>

        {history.length > 0 && (
          <button
            onClick={clearAll}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">
          No images generated yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {history.map((item, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-4 relative flex flex-col gap-3">

              {/* ✅ Delete button */}
              <button
                onClick={() => deleteItem(index)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition cursor-pointer z-10"
              >
                ✕
              </button>

              {/* Image */}
              <img
                src={item.image}
                alt={`Generated ${index + 1}`}
                className="w-full rounded"
                onError={(e) => { e.target.style.display = "none"; }}
              />

              {/* ✅ Download Image Button */}
              <button
                onClick={() => downloadImage(item.image, item.product, index)}
                className="w-full bg-blue-400 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                Download Image
              </button>

              {/* Date */}
              <p className="text-xs text-gray-400">
                {new Date(item.date).toLocaleString()}
              </p>

              {/* Caption */}
              {item.caption && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">

                  {/* Caption header with copy button */}
                  <div className="bg-green-300 px-3 py-2 flex justify-between items-center">
                    <span className="text-sm font-semibold">Caption</span>

                    {/* ✅ Copy Caption Button with feedback */}
                    <button
                      onClick={() => copyCaption(item.caption, index)}
                      className="text-xs font-bold hover:text-blue-700 cursor-pointer transition"
                    >
                      {copiedIndex === index ? "✅ Copied!" : "Copy"}
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 whitespace-pre-line p-3">
                    {item.caption}
                  </p>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default ImageHistory;
