import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useIkeaSearch from "../hooks/useIkeaSearch";

export default function RecommendationsScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // label comes from ScanningScreen navigate("/recommendations", { state: { label } })
  const label = (location.state?.label || "chair").toLowerCase();

  const { data, loading, error } = useIkeaSearch(label);
  const products = Array.isArray(data?.results) ? data.results : [];

  return (
    <div className="min-h-screen bg-white px-4 pt-6 pb-24 text-black">
      <h1 className="text-2xl font-bold mb-2">Recommendations</h1>
      <p className="text-gray-600 mb-6">
        Based on: <span className="capitalize">{label}</span>
      </p>

      {loading && <p>Searching IKEA for “{label}”...</p>}
      {error && <p className="text-red-600">Error: {error.message || "Failed to load products."}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      <div className="space-y-6">
        {products.map((item, index) => {
          const link =
            item.url ||
            `https://www.ikea.com/search/?q=${encodeURIComponent(item.name || label)}`;

        return (
          <div key={index} className="flex items-start gap-4 bg-[#F8F9FF] p-4 rounded-lg shadow-sm">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-contain rounded-lg flex-shrink-0"
              />
            )}

            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-2">
                {item.description || `Explore the ${item.name} on IKEA.`}
              </p>
              <h3 className="font-bold mb-2">{item.name}</h3>
              {item.price != null && (
                <p className="text-sm text-gray-900 mb-3">${item.price}</p>
              )}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#1D1E5A] text-white text-sm font-semibold px-4 py-2 rounded-full hover:brightness-110 transition"
              >
                Check on website
              </a>
            </div>
          </div>
        );
        })}
      </div>

      <button
        onClick={() => navigate("/scan")}
        className="mt-8 w-full py-3 bg-black text-white rounded-lg font-semibold"
      >
        Scan Another Item
      </button>
    </div>
  );
}
