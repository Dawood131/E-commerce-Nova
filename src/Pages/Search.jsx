import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Products/ProductCard";
import { FiSearch } from "react-icons/fi";
import { products } from "../components/data/products";
import MainBtn from "../components/Button/MainBtn";

// Skeleton
const ProductCardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </div>
    <div className="mt-2 h-4 w-3/4 rounded bg-gray-200 relative overflow-hidden">
      <div
        className="absolute inset-0 rounded"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </div>
    <div className="mt-1 h-3 w-1/2 rounded bg-gray-200 relative overflow-hidden">
      <div
        className="absolute inset-0 rounded"
        style={{
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% 0",
          animation: "shimmer 1.5s linear infinite",
        }}
      />
    </div>

    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

// Product wrapper to handle skeleton + actual product
const ProductWrapper = ({ product }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return imgLoaded ? (
    <ProductCard product={product} />
  ) : (
    <div className="relative">
      <ProductCardSkeleton />
      <img
        src={product.image[0]} // assuming image array
        alt={product.name}
        className="hidden"
        onLoad={() => setImgLoaded(true)}
      />
    </div>
  );
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]);

  useEffect(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setInitialProducts(shuffled.slice(0, 8));
    setResults(shuffled.slice(0, 8));
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults(initialProducts);
    } else {
      const q = query.toLowerCase().trim();
      const filtered = products.filter((p) => {
        if (["men", "women", "kids"].includes(q)) {
          return p.category.toLowerCase() === q;
        }
        const matchName = p.name.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase() === q;
        const matchSub = p.subCategory.toLowerCase() === q;
        return matchName || matchCategory || matchSub;
      });
      setResults(filtered);
    }
  }, [query, initialProducts]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="md:hidden w-full flex justify-center items-center py-2 bg-white">
        <NavLink to="/">
          <img src="/logo-header.png" alt="Logo" className="h-14 w-auto" />
        </NavLink>
      </div>

      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 py-10">
        <h1 className="md:hidden font-semibold text-2xl mb-3 -mt-8">Search</h1>

        <div className="relative w-full flex items-center mb-8">
          <FiSearch
            size={22}
            className="absolute left-4 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl shadow-md border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm placeholder-gray-400 transition"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mt-6 mt-3">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">
            {query ? `Showing results for "${query}"` : "Explore Featured Products"}
          </h2>
          <span className="text-gray-500 text-sm">{results.length} items found</span>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6 mt-6">
            {results.map((product) => (
              <ProductWrapper key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              We couldn't find any products matching your search. Try different keywords or browse our latest collection.
            </p>
            <NavLink to={"/"}>
              <MainBtn text={"Continue Shopping"} className="rounded-lg px-4"/>
            </NavLink>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;
